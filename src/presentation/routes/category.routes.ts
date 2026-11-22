import { Router } from "express";
import type { RequestHandler } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { USER_ROLES } from "../../domain/enums/user-role.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/category.validator.js";
import { validateQuery } from "../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../validators/pagination.validator.js";

export function createCategoryRoutes(
  controller: CategoryController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    requireRole(USER_ROLES.ADMIN),
    validateBody(createCategorySchema),
    controller.create,
  );

  router.get("/", validateQuery(paginationQuerySchema), controller.findAll);
  router.get("/:id", controller.findById);

  router.patch(
    "/:id",
    authMiddleware,
    requireRole(USER_ROLES.ADMIN),
    validateBody(updateCategorySchema),
    controller.update,
  );

  return router;
}
