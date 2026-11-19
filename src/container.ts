import { prisma } from "./infrastructure/database/prisma/client.js";

import { PrismaUserRepository } from "./infrastructure/database/prisma/prisma-user.repository.js";
import { CreateUserUseCase } from "./application/use-cases/user/create-user.use-case.js";
import { UserController } from "./presentation/controllers/user.controller.js";
import { createUserRoutes } from "./presentation/routes/user.routes.js";

export function createContainer() {
  const userRepository = new PrismaUserRepository(prisma);

  const createUserUseCase = new CreateUserUseCase(
    userRepository,
  );

  const userController = new UserController(
    createUserUseCase,
  );

  const userRoutes = createUserRoutes(userController);

  return {
    userRoutes,
  };
}