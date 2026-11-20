import { prisma } from "./infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "./infrastructure/database/prisma/prisma-user.repository.js";
import { CreateUserUseCase } from "./application/use-cases/user/create-user.use-case.js";
import { UserController } from "./presentation/controllers/user.controller.js";
import { createUserRoutes } from "./presentation/routes/user.routes.js";
import { GetUserByIdUseCase } from "./application/use-cases/user/get-user-by-id.use-case.js";
import { GetUsersUseCase } from "./application/use-cases/user/get-users.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/user/update-user.use-case.js";

export function createContainer() {
  const userRepository = new PrismaUserRepository(prisma);

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);

  const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase,
    getUsersUseCase,
    updateUserUseCase,
  );

  const userRoutes = createUserRoutes(userController);

  return {
    userRoutes,
  };
}
