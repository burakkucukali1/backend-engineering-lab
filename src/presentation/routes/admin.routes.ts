import { Router } from "express";
import type { RequestHandler } from "express";
import { requireRole } from "../../middlewares/role.middleware.js";
import { AdminController } from "../controllers/admin.controller.js";
import { USER_ROLES } from "../../domain/enums/user-role.js";

export function createAdminRoutes(
  adminController: AdminController,
  authMiddleware: RequestHandler,
) {
  const router = Router();

  router.get(
    "/dashboard",
    authMiddleware,
    requireRole(USER_ROLES.ADMIN),
    adminController.dashboard,
  );

  return router;
}
