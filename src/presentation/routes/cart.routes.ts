import { Router } from "express";
import type { RequestHandler } from "express";

import { CartController } from "../controllers/cart.controller.js";
import { validateBody } from "../../middlewares/validate.middleware.js";
import { addCartItemSchema } from "../validators/cart.validator.js";

export function createCartRoutes(
  controller: CartController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.get("/", authMiddleware, controller.getCart);

  router.post(
    "/items",
    authMiddleware,
    validateBody(addCartItemSchema),
    controller.addItem,
  );

  router.delete("/items/:productId", authMiddleware, controller.removeItem);

  return router;
}
