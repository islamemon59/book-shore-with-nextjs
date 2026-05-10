import { prisma } from "../../lib/prisma.js";
import type { UpdatePreferencesInput, UpdateProfileInput } from "./users.validation.js";

export const getCurrentUserProfile = async (userId: string) => {
  const [user, cartCount, orderCount] = await prisma.$transaction([
    prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        preferences: true,
      },
    }),
    prisma.cartItem.count({
      where: { userId },
    }),
    prisma.order.count({
      where: { userId },
    }),
  ]);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    emailVerified: user.emailVerified,
    preferences: {
      favoriteGenres: Array.isArray(user.preferences?.favoriteGenres)
        ? user.preferences.favoriteGenres
        : [],
      favoriteFormats: Array.isArray(user.preferences?.favoriteFormats)
        ? user.preferences.favoriteFormats
        : [],
      monthlyBudget: user.preferences?.monthlyBudget ? Number(user.preferences.monthlyBudget) : null,
      readingGoal: user.preferences?.readingGoal ?? null,
    },
    stats: {
      cartCount,
      orderCount,
    },
  };
};

export const updateCurrentUserProfile = async (userId: string, input: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: input.name,
      image: input.image || null,
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
  };
};

export const updateCurrentUserPreferences = async (userId: string, input: UpdatePreferencesInput) => {
  const preferences = await prisma.userPreference.upsert({
    where: { userId },
    update: {
      favoriteGenres: input.favoriteGenres,
      favoriteFormats: input.favoriteFormats,
      monthlyBudget: typeof input.monthlyBudget === "number" ? input.monthlyBudget : null,
      readingGoal: input.readingGoal ?? null,
    },
    create: {
      userId,
      favoriteGenres: input.favoriteGenres,
      favoriteFormats: input.favoriteFormats,
      monthlyBudget: typeof input.monthlyBudget === "number" ? input.monthlyBudget : null,
      readingGoal: input.readingGoal ?? null,
    },
  });

  return {
    favoriteGenres: Array.isArray(preferences.favoriteGenres) ? preferences.favoriteGenres : [],
    favoriteFormats: Array.isArray(preferences.favoriteFormats) ? preferences.favoriteFormats : [],
    monthlyBudget: preferences.monthlyBudget ? Number(preferences.monthlyBudget) : null,
    readingGoal: preferences.readingGoal,
  };
};
