import { Router } from "express";

import { UserController } from "../controllers/user.controller.js";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/", userController.create);
  router.get("/", userController.getAll);
  router.get("/:id", userController.getById);
  router.patch("/:id", userController.update);

  return router;
}
