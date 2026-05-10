import { env } from "../config/env.js";
import { auth } from "./auth.js";
import { logger } from "./logger.js";
import { prisma } from "./prisma.js";

export const ensureAdminUser = async () => {
  const existingAdmin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
    select: { email: true },
  });

  if (existingAdmin) {
    logger.info({ email: existingAdmin.email }, "Admin user already exists.");
    return;
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: env.ADMIN_EMAIL },
    select: { id: true, email: true },
  });

  if (existingUser) {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: "ADMIN" },
    });

    logger.info({ email: existingUser.email }, "Promoted configured user to admin.");
    return;
  }

  await (auth.api.signUpEmail as any)({
    body: {
      name: env.ADMIN_NAME,
      email: env.ADMIN_EMAIL,
      password: env.ADMIN_PASSWORD,
      image: env.ADMIN_IMAGE,
    },
  });

  await prisma.user.update({
    where: { email: env.ADMIN_EMAIL },
    data: {
      role: "ADMIN",
      emailVerified: true,
    },
  });

  logger.info({ email: env.ADMIN_EMAIL }, "Created startup admin user.");
};
