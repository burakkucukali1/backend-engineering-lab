import { Router } from "express";

import { UserController } from "../controllers/user.controller.js";

export function createUserRoutes(userController: UserController) {
  const router = Router();

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Create a new user
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - firstName
   *               - lastName
   *             properties:
   *               email:
   *                 type: string
   *                 example: burak@example.com
   *               firstName:
   *                 type: string
   *                 example: Burak
   *               lastName:
   *                 type: string
   *                 example: Yilmaz
   *     responses:
   *       201:
   *         description: User created successfully
   *       400:
   *         description: Validation failed
   *       409:
   *         description: User already exists
   */

  router.post("/", userController.create);
  router.get("/", userController.getAll);
  router.get("/:id", userController.getById);
  router.patch("/:id", userController.update);

  return router;
}
