import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { validateParams } from "../../middlewares/validate.middleware.js";
import { validateQuery } from "../../middlewares/validate.middleware.js";
import {
  createUserSchema,
  updateUserSchema,
  paginationSchema,
  userIdSchema,
} from "../validators/user.validator.js";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  router.post("/", validateBody(createUserSchema), userController.create);

  router.get("/", validateQuery(paginationSchema), userController.getAll);

  router.get("/:id", validateParams(userIdSchema), userController.getById);

  router.patch(
    "/:id",
    validateParams(userIdSchema),
    validateBody(updateUserSchema),
    userController.update,
  );

  return router;
}
