import { Router } from "express";

import { AuthController } from "../controllers/auth.controller.js";

export function createAuthRoutes(authController: AuthController) {
  const router = Router();

  router.post("/register", authController.register);

  return router;
}
