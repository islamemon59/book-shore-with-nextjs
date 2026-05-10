import { prisma } from "../../lib/prisma.js";
import { enqueueOrderEvent } from "../../lib/queue.js";
import { createSslcommerzSession, validateSslcommerzTransaction } from "../../lib/sslcommerz.js";
import { logger } from "../../lib/logger.js";
import { AppError } from "../../utils/http.js";
import type { CheckoutInput, CompleteCheckoutPaymentInput } from "./orders.validation.js";

const createOrderNumber = () =>
  `BS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const toCheckoutOrder = (order: {
  id: string;
  orderNumber: string;
  total: unknown;
  status: string;
  createdAt: Date;
}) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  total: Number(order.total),
  status: order.status,
  createdAt: order.createdAt,
});

export const listUserOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      userId,
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    subtotal: Number(order.subtotal),
    shippingFee: Number(order.shippingFee),
    total: Number(order.total),
    createdAt: order.createdAt,
    items: order.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      lineTotal: Number(item.lineTotal),
      book: {
        slug: item.book.slug,
        title: item.book.title,
        coverImage: item.book.coverImage,
      },
    })),
  }));
};

export const checkout = async (userId: string, input: CheckoutInput) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { book: true },
  });

  if (cartItems.length === 0) {
    throw new AppError(400, "Your cart is empty.");
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 9.5;
  const total = subtotal + shippingFee;
  const orderNumber = createOrderNumber();

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        orderNumber,
        subtotal,
        shippingFee,
        total,
        notes: input.notes,
        paymentStatus: "PAID",
        status: "PROCESSING",
        shippingAddress: input.shippingAddress,
        items: {
          create: cartItems.map((item) => ({
            bookId: item.bookId,
            quantity: item.quantity,
            unitPrice: item.book.price,
            lineTotal: Number(item.book.price) * item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    await Promise.all(
      cartItems.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    await tx.cartItem.deleteMany({
      where: { userId },
    });

    await tx.notification.create({
      data: {
        userId,
        type: "ORDER",
        title: "Order confirmed",
        message: `Your order ${orderNumber} is now being prepared by the BookShore team.`,
        metadata: {
          orderNumber,
        },
      },
    });

    return createdOrder;
  });

  await enqueueOrderEvent({
    orderId: order.id,
    userId,
    orderNumber: order.orderNumber,
  });

  return toCheckoutOrder(order);
};

export const startCheckoutPayment = async (userId: string, input: CheckoutInput) => {
  const cartItems = await prisma.cartItem.findMany({
    where: { userId },
    include: { book: true },
  });

  if (cartItems.length === 0) {
    throw new AppError(400, "Your cart is empty.");
  }

  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);
  const shippingFee = subtotal > 100 ? 0 : 9.5;
  const total = subtotal + shippingFee;
  const orderNumber = createOrderNumber();

  const order = await prisma.order.create({
    data: {
      userId,
      orderNumber,
      subtotal,
      shippingFee,
      total,
      notes: input.notes,
      paymentStatus: "UNPAID",
      status: "PENDING",
      shippingAddress: input.shippingAddress,
      items: {
        create: cartItems.map((item) => ({
          bookId: item.bookId,
          quantity: item.quantity,
          unitPrice: item.book.price,
          lineTotal: Number(item.book.price) * item.quantity,
        })),
      },
    },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  let session;

  try {
    session = await createSslcommerzSession({
      orderNumber: order.orderNumber,
      total: Number(order.total),
      shippingAddress: input.shippingAddress,
      notes: input.notes,
      items: order.items.map((item) => ({
        title: item.book.title,
        author: item.book.author,
        quantity: item.quantity,
      })),
    });
  } catch (error) {
    try {
      await prisma.order.delete({
        where: { id: order.id },
      });
    } catch (cleanupError) {
      logger.error(
        {
          cleanupError,
          orderId: order.id,
          orderNumber: order.orderNumber,
        },
        "Failed to clean up pending order after SSLCommerz session creation failed",
      );
    }

    throw error;
  }

  return {
    order: toCheckoutOrder(order),
    url: session.url,
  };
};

export const completeCheckoutPaymentByTransaction = async (
  input: CompleteCheckoutPaymentInput,
  expectedUserId?: string,
) => {
  const order = await prisma.order.findUnique({
    where: { orderNumber: input.tranId },
    include: {
      items: {
        include: {
          book: true,
        },
      },
    },
  });

  if (!order || (expectedUserId && order.userId !== expectedUserId)) {
    throw new AppError(404, "Order not found.");
  }

  if (order.paymentStatus === "PAID") {
    return toCheckoutOrder(order);
  }

  const validation = await validateSslcommerzTransaction(input.valId);
  const validationStatus = validation.status?.toUpperCase();
  const validationAmount = Number(validation.amount);

  if (validation.tran_id !== order.orderNumber) {
    throw new AppError(400, "Payment transaction does not match this order.");
  }

  if (!["VALID", "VALIDATED"].includes(validationStatus ?? "")) {
    throw new AppError(400, "SSLCommerz payment is not valid yet.");
  }

  if (Number.isNaN(validationAmount) || Math.abs(validationAmount - Number(order.total)) > 0.01) {
    throw new AppError(400, "SSLCommerz payment amount does not match this order.");
  }

  const paidOrder = await prisma.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: "UNPAID",
      },
      data: {
        paymentStatus: "PAID",
        status: "PROCESSING",
      },
    });

    const updatedOrder = await tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: {
        items: {
          include: {
            book: true,
          },
        },
      },
    });

    if (count === 0) {
      return updatedOrder;
    }

    await Promise.all(
      order.items.map((item) =>
        tx.book.update({
          where: { id: item.bookId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        }),
      ),
    );

    await tx.cartItem.deleteMany({
      where: { userId: order.userId },
    });

    await tx.notification.create({
      data: {
        userId: order.userId,
        type: "ORDER",
        title: "Order confirmed",
        message: `Your order ${order.orderNumber} is now being prepared by the BookShore team.`,
        metadata: {
          orderNumber: order.orderNumber,
          paymentGateway: "sslcommerz",
          valId: input.valId,
        },
      },
    });

    return updatedOrder;
  });

  await enqueueOrderEvent({
    orderId: paidOrder.id,
    userId: order.userId,
    orderNumber: paidOrder.orderNumber,
  });

  return toCheckoutOrder(paidOrder);
};

export const completeCheckoutPayment = async (
  userId: string,
  input: CompleteCheckoutPaymentInput,
) => completeCheckoutPaymentByTransaction(input, userId);
