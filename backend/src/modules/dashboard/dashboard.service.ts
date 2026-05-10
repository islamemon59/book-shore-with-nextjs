import { prisma } from "../../lib/prisma.js";
import { AppError, buildPageMeta } from "../../utils/http.js";
import type { DashboardBooksQuery, DashboardOrdersQuery } from "./dashboard.validation.js";

const shiftMonth = (baseDate: Date, monthsBack: number) =>
  new Date(baseDate.getFullYear(), baseDate.getMonth() - monthsBack, 1);

export const getDashboardOverview = async (userId: string, role: string) => {
  if (role === "USER") {
    const [cartCount, orderCount, orderAgg, recentOrders, preferences] = await prisma.$transaction([
      prisma.cartItem.count({ where: { userId } }),
      prisma.order.count({ where: { userId } }),
      prisma.order.aggregate({
        where: { userId },
        _sum: { total: true },
      }),
      prisma.order.findMany({
        where: { userId },
        include: { items: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.userPreference.findUnique({ where: { userId } }),
    ]);

    const lastSixMonths = Array.from({ length: 6 }).map((_, index) => {
      const date = shiftMonth(new Date(), 5 - index);
      const monthlyOrders = recentOrders.filter(
        (order) =>
          order.createdAt.getMonth() === date.getMonth() &&
          order.createdAt.getFullYear() === date.getFullYear(),
      );

      return {
        label: date.toLocaleString("en-US", { month: "short" }),
        revenue: monthlyOrders.reduce((sum, order) => sum + Number(order.total), 0),
        orders: monthlyOrders.length,
      };
    });

    const preferenceMix = (
      Array.isArray(preferences?.favoriteFormats) ? preferences.favoriteFormats : ["Paperback", "Hardcover"]
    ).map((item) => ({ name: String(item), value: 1 }));

    return {
      cards: {
        books: cartCount,
        readers: Array.isArray(preferences?.favoriteGenres) ? preferences.favoriteGenres.length : 0,
        orders: orderCount,
        revenue: Number(orderAgg._sum.total ?? 0),
      },
      charts: {
        revenueByMonth: lastSixMonths,
        formatMix: preferenceMix,
      },
      tables: {
        lowStock: [],
        newReaders: [],
      },
    };
  }

  const [bookCount, userCount, orderCount, revenueAgg, recentOrders, inventorySnapshot, recentUsers] =
    await prisma.$transaction([
      prisma.book.count(),
      prisma.user.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true,
        },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 120,
      }),
      prisma.book.findMany({
        select: {
          format: true,
          inventory: true,
          featured: true,
        },
      }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
      }),
    ]);

  const lastSixMonths = Array.from({ length: 6 }).map((_, index) => {
    const date = shiftMonth(new Date(), 5 - index);
    const label = date.toLocaleString("en-US", { month: "short" });
    const monthlyOrders = recentOrders.filter(
      (order) =>
        order.createdAt.getMonth() === date.getMonth() &&
        order.createdAt.getFullYear() === date.getFullYear(),
    );

    return {
      label,
      revenue: monthlyOrders.reduce((sum, order) => sum + Number(order.total), 0),
      orders: monthlyOrders.length,
    };
  });

  const formatChart = Object.entries(
    inventorySnapshot.reduce((acc: Record<string, number>, book) => {
      acc[book.format] = (acc[book.format] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([name, value]) => ({ name, value }));

  const lowStockBooks = await prisma.book.findMany({
    where: {
      inventory: {
        lte: 8,
      },
    },
    orderBy: { inventory: "asc" },
    take: 5,
  });

  return {
    cards: {
      books: bookCount,
      readers: userCount,
      orders: orderCount,
      revenue: Number(revenueAgg._sum.total ?? 0),
    },
    charts: {
      revenueByMonth: lastSixMonths,
      formatMix: formatChart,
    },
    tables: {
      lowStock: lowStockBooks.map((book) => ({
        id: book.id,
        title: book.title,
        inventory: book.inventory,
        format: book.format,
      })),
      newReaders: recentUsers.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joinedAt: user.createdAt,
      })),
    },
  };
};

export const listDashboardBooks = async (role: string, query: DashboardBooksQuery) => {
  if (role === "USER") {
    throw new AppError(403, "You do not have permission to access catalog management.");
  }

  const where = query.search
    ? {
        OR: [
          { title: { contains: query.search, mode: "insensitive" as const } },
          { author: { contains: query.search, mode: "insensitive" as const } },
          { isbn: { contains: query.search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.book.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.book.count({ where }),
  ]);

  return {
    items: items.map((book) => ({
      id: book.id,
      title: book.title,
      author: book.author,
      inventory: book.inventory,
      price: Number(book.price),
      rating: Number(book.rating),
      featured: book.featured,
      updatedAt: book.updatedAt,
    })),
    meta: buildPageMeta(query.page, query.limit, total),
  };
};

export const listDashboardOrders = async (
  userId: string,
  role: string,
  query: DashboardOrdersQuery,
) => {
  const where = {
    ...(role === "USER" ? { userId } : {}),
    ...(query.search
      ? {
          orderNumber: {
            contains: query.search,
            mode: "insensitive" as const,
          },
        }
      : {}),
    ...(query.status ? { status: query.status } : {}),
  };

  const [items, total] = await prisma.$transaction([
    prisma.order.findMany({
      where,
      include: {
        user: true,
        items: true,
      },
      orderBy: { createdAt: "desc" },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: items.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: role === "USER" ? "You" : order.user.name,
      status: order.status,
      paymentStatus: order.paymentStatus,
      itemCount: order.items.reduce((sum, item) => sum + item.quantity, 0),
      total: Number(order.total),
      createdAt: order.createdAt,
    })),
    meta: buildPageMeta(query.page, query.limit, total),
  };
};
