import { Router } from "express";
import type { RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { registerSchema } from "../validators/auth.validator.js";
import { loginSchema } from "../validators/login.validator.js";

export function createAuthRoutes(
  authController: AuthController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.post(
    "/register",
    validateBody(registerSchema),
    authController.register,
  );

  router.post("/login", validateBody(loginSchema), authController.login);

  router.get("/me", authMiddleware, authController.me);

  return router;
}
