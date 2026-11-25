import { Router } from "express";
import type { RequestHandler } from "express";

import type { OrderController } from "../controllers/order.controller.js";
import { requireRole } from "../../middlewares/role.middleware.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { USER_ROLES } from "../../domain/enums/user-role.js";
import { updateOrderStatusSchema } from "../validators/order.validator.js";

export function createOrderRoutes(
  orderController: OrderController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.use(authMiddleware);

  router.post("/checkout", orderController.checkout);
  router.get("/me", orderController.getMyOrders);

  router.patch(
    "/:id/status",
    requireRole(USER_ROLES.ADMIN),
    validateBody(updateOrderStatusSchema),
    orderController.updateStatus,
  );

  router.get("/:id", orderController.getOrderById);

  return router;
}
