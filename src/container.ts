import { prisma } from "./infrastructure/database/prisma/client.js";

// Repositories
import { PrismaUserRepository } from "./infrastructure/database/prisma/prisma-user.repository.js";
import { PrismaCategoryRepository } from "./infrastructure/database/prisma/prisma-category.repository.js";
import { PrismaProductRepository } from "./infrastructure/database/prisma/prisma-product.repository.js";

// User Use Cases
import { CreateUserUseCase } from "./application/use-cases/user/create-user.use-case.js";
import { GetUserByIdUseCase } from "./application/use-cases/user/get-user-by-id.use-case.js";
import { GetUsersUseCase } from "./application/use-cases/user/get-users.use-case.js";
import { UpdateUserUseCase } from "./application/use-cases/user/update-user.use-case.js";

// Auth Use Cases
import { RegisterUseCase } from "./application/use-cases/auth/register.use-case.js";
import { LoginUseCase } from "./application/use-cases/auth/login.use-case.js";

// Category Use Cases
import { CreateCategoryUseCase } from "./application/use-cases/category/create-category.use-case.js";
import { GetCategoryByIdUseCase } from "./application/use-cases/category/get-category-by-id.use-case.js";
import { GetCategoriesUseCase } from "./application/use-cases/category/get-categories.use-case.js";
import { UpdateCategoryUseCase } from "./application/use-cases/category/update-category.use-case.js";

// Product Use Cases
import { CreateProductUseCase } from "./application/use-cases/product/create-product.use-case.js";
import { GetProductByIdUseCase } from "./application/use-cases/product/get-product-by-id.use-case.js";
import { GetProductsUseCase } from "./application/use-cases/product/get-products.use-case.js";
import { UpdateProductUseCase } from "./application/use-cases/product/update-product.use-case.js";

// Security
import { Argon2PasswordHasher } from "./infrastructure/security/argon2-password-hasher.js";
import { JoseTokenService } from "./infrastructure/security/jose-token-service.js";
import { createAuthMiddleware } from "./middlewares/auth.middleware.js";

// Controllers
import { UserController } from "./presentation/controllers/user.controller.js";
import { AuthController } from "./presentation/controllers/auth.controller.js";
import { AdminController } from "./presentation/controllers/admin.controller.js";
import { CategoryController } from "./presentation/controllers/category.controller.js";
import { ProductController } from "./presentation/controllers/product.controller.js";

// Routes
import { createUserRoutes } from "./presentation/routes/user.routes.js";
import { createAuthRoutes } from "./presentation/routes/auth.routes.js";
import { createAdminRoutes } from "./presentation/routes/admin.routes.js";
import { createCategoryRoutes } from "./presentation/routes/category.routes.js";
import { createProductRoutes } from "./presentation/routes/product.routes.js";

export function createContainer() {
  // Repositories
  const userRepository = new PrismaUserRepository(prisma);
  const categoryRepository = new PrismaCategoryRepository();
  const productRepository = new PrismaProductRepository();

  // Security services
  const passwordHasher = new Argon2PasswordHasher();
  const tokenService = new JoseTokenService();

  // User Use Cases
  const createUserUseCase = new CreateUserUseCase(userRepository);
  const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
  const getUsersUseCase = new GetUsersUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);

  // Auth Use Cases
  const registerUseCase = new RegisterUseCase(userRepository, passwordHasher);
  const loginUseCase = new LoginUseCase(
    userRepository,
    passwordHasher,
    tokenService,
  );

  // Category Use Cases
  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  const getCategoryByIdUseCase = new GetCategoryByIdUseCase(categoryRepository);
  const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepository);
  const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepository);

  // Product Use Cases
  const createProductUseCase = new CreateProductUseCase(
    productRepository,
    categoryRepository,
  );
  const getProductByIdUseCase = new GetProductByIdUseCase(productRepository);
  const getProductsUseCase = new GetProductsUseCase(productRepository);
  const updateProductUseCase = new UpdateProductUseCase(
    productRepository,
    categoryRepository,
  );

  // Controllers
  const adminController = new AdminController();

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

  const categoryController = new CategoryController(
    createCategoryUseCase,
    getCategoryByIdUseCase,
    getCategoriesUseCase,
    updateCategoryUseCase,
  );

  const productController = new ProductController(
    createProductUseCase,
    getProductByIdUseCase,
    getProductsUseCase,
    updateProductUseCase,
  );

  // Middleware
  const authMiddleware = createAuthMiddleware(tokenService, userRepository);

  // Routes
  const userRoutes = createUserRoutes(userController);
  const authRoutes = createAuthRoutes(authController, authMiddleware);
  const adminRoutes = createAdminRoutes(adminController, authMiddleware);
  const categoryRoutes = createCategoryRoutes(
    categoryController,
    authMiddleware,
  );
  const productRoutes = createProductRoutes(productController, authMiddleware);

  return {
    userRoutes,
    authRoutes,
    adminRoutes,
    categoryRoutes,
    productRoutes,
    authMiddleware,
  };
}
