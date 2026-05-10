import { Router } from "express";
import { requireSession } from "../../middlewares/require-session.js";
import { validateRequest } from "../../middlewares/validate-request.js";
import {
  getCurrentUserProfileController,
  updateCurrentUserPreferencesController,
  updateCurrentUserProfileController,
} from "./users.controller.js";
import { updatePreferencesSchema, updateProfileSchema } from "./users.validation.js";

export const usersRouter = Router();

usersRouter.use(requireSession);

usersRouter.get("/me", getCurrentUserProfileController);

usersRouter.patch("/me", validateRequest(updateProfileSchema), updateCurrentUserProfileController);

usersRouter.put(
  "/me/preferences",
  validateRequest(updatePreferencesSchema),
  updateCurrentUserPreferencesController,
);
