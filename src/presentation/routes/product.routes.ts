import { Router } from "express";
import type { RequestHandler } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { USER_ROLES } from "../../domain/enums/user-role.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/product.validator.js";
import { validateQuery } from "../../middlewares/validate.middleware.js";
import { paginationQuerySchema } from "../validators/pagination.validator.js";

export function createProductRoutes(
  controller: ProductController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.post(
    "/",
    authMiddleware,
    requireRole(USER_ROLES.ADMIN),
    validateBody(createProductSchema),
    controller.create,
  );

  router.get("/", validateQuery(paginationQuerySchema), controller.findAll);
  router.get("/:id", controller.findById);

  router.patch(
    "/:id",
    authMiddleware,
    requireRole(USER_ROLES.ADMIN),
    validateBody(updateProductSchema),
    controller.update,
  );

  return router;
}
