import { prisma } from "./infrastructure/database/prisma/client.js";
import { PrismaUserRepository } from "./infrastructure/database/prisma/prisma-user.repository.js";
import { CreateUserUseCase } from "./application/use-cases/user/create-user.use-case.js";
import { UserController } from "./presentation/controllers/user.controller.js";
import { createUserRoutes } from "./presentation/routes/user.routes.js";
import { GetUserByIdUseCase } from "./application/use-cases/user/get-user-by-id.use-case.js";
import { GetUsersUseCase } from "./application/use-cases/user/get-users.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/user/update-user.use-case.js";
import { Argon2PasswordHasher } from "./infrastructure/security/argon2-password-hasher.js";
import { RegisterUseCase } from "./application/use-cases/auth/register.use-case.js";
import { AuthController } from "./presentation/controllers/auth.controller.js";
import { createAuthRoutes } from "./presentation/routes/auth.routes.js";
import { JoseTokenService } from "./infrastructure/security/jose-token-service.js";
import { LoginUseCase } from "./application/use-cases/auth/login.use-case.js";
import { createAuthMiddleware } from "./middlewares/auth.middleware.js";

export function createContainer() {
  const userRepository = new PrismaUserRepository(prisma);

  const passwordHasher = new Argon2PasswordHasher();
  const tokenService = new JoseTokenService();

  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordHasher,
    tokenService,
  );

  const authController = new AuthController(
    registerUseCase,
    loginUseCase,
    getUserByIdUseCase,
  );

  const userController = new UserController(
    createUserUseCase,
    getUserByIdUseCase,
    getUsersUseCase,
    updateUserUseCase,
  );

  const authMiddleware = createAuthMiddleware(tokenService);

  const userRoutes = createUserRoutes(userController);
  const authRoutes = createAuthRoutes(authController, authMiddleware);

  return {
    userRoutes,
    authRoutes,
    authMiddleware,
  };
}
