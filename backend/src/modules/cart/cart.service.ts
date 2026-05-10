import { prisma } from "../../lib/prisma.js";
import { AppError } from "../../utils/http.js";
import type { AddCartItemInput, UpdateCartItemInput } from "./cart.validation.js";

export const getCart = async (userId: string) => {
  const items = await prisma.cartItem.findMany({
    where: {
      userId,
    },
    include: {
      book: {
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.book.price) * item.quantity, 0);

  return {
    items: items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      book: {
        id: item.book.id,
        slug: item.book.slug,
        title: item.book.title,
        author: item.book.author,
        coverImage: item.book.coverImage,
        price: Number(item.book.price),
        format: item.book.format,
        inventory: item.book.inventory,
      },
      lineTotal: Number(item.book.price) * item.quantity,
    })),
    summary: {
      subtotal,
      shippingFee: subtotal === 0 ? 0 : subtotal > 100 ? 0 : 9.5,
      total: subtotal === 0 ? 0 : subtotal + (subtotal > 100 ? 0 : 9.5),
    },
  };
};

export const addCartItem = (userId: string, input: AddCartItemInput) =>
  prisma.cartItem.upsert({
    where: {
      userId_bookId: {
        userId,
        bookId: input.bookId,
      },
    },
    update: {
      quantity: {
        increment: input.quantity,
      },
    },
    create: {
      userId,
      bookId: input.bookId,
      quantity: input.quantity,
    },
  });

export const updateCartItemQuantity = async (
  userId: string,
  itemId: string,
  input: UpdateCartItemInput,
) => {
  const { count } = await prisma.cartItem.updateMany({
    where: {
      id: itemId,
      userId,
    },
    data: {
      quantity: input.quantity,
    },
  });

  if (count === 0) {
    throw new AppError(404, "Cart item not found.");
  }

  return prisma.cartItem.findUniqueOrThrow({
    where: {
      id: itemId,
    },
  });
};

export const removeCartItem = (userId: string, itemId: string) =>
  prisma.cartItem.deleteMany({
    where: {
      id: itemId,
      userId,
    },
  });
