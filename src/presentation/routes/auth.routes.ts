import { Router } from "express";
import type { RequestHandler } from "express";
import { AuthController } from "../controllers/auth.controller.js";

export function createAuthRoutes(
  authController: AuthController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.post("/register", authController.register);
  router.post("/login", authController.login);
  router.get("/me", authMiddleware, authController.me);

  return router;
}
