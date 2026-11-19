import { Router } from "express";

import { UserController } from "../controllers/user.controller.js";

export function createUserRoutes(
  userController: UserController,
) {
  const router = Router();

  router.post("/", userController.create);

  return router;
}