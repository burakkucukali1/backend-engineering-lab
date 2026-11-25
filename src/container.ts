import { prisma } from "./infrastructure/database/prisma/client.js";

// Repositories
import { PrismaUserRepository } from "./infrastructure/database/prisma/prisma-user.repository.js";
import { PrismaCategoryRepository } from "./infrastructure/database/prisma/prisma-category.repository.js";
import { PrismaProductRepository } from "./infrastructure/database/prisma/prisma-product.repository.js";
import { PrismaCartRepository } from "./infrastructure/database/prisma/prisma-cart.repository.js";
import { PrismaOrderRepository } from "./infrastructure/database/prisma/prisma-order.repository.js";

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

// Cart Use Cases
import { AddItemToCartUseCase } from "./application/use-cases/cart/add-item-to-cart.use-case.js";
import { GetCartUseCase } from "./application/use-cases/cart/get-cart.use-case.js";
import { RemoveCartItemUseCase } from "./application/use-cases/cart/remove-cart-item.use-case.js";
import { CheckoutUseCase } from "./application/use-cases/order/checkout.use-case.js";
import { UpdateOrderStatusUseCase } from "./application/use-cases/order/update-order-status.use-case.js";

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
import { CartController } from "./presentation/controllers/cart.controller.js";
import { OrderController } from "./presentation/controllers/order.controller.js";

// Routes
import { createUserRoutes } from "./presentation/routes/user.routes.js";
import { createAuthRoutes } from "./presentation/routes/auth.routes.js";
import { createAdminRoutes } from "./presentation/routes/admin.routes.js";
import { createCategoryRoutes } from "./presentation/routes/category.routes.js";
import { createProductRoutes } from "./presentation/routes/product.routes.js";
import { createCartRoutes } from "./presentation/routes/cart.routes.js";
import { createOrderRoutes } from "./presentation/routes/order.routes.js";

export function createContainer() {
  // Repositories
  const userRepository = new PrismaUserRepository(prisma);
  const categoryRepository = new PrismaCategoryRepository();
  const productRepository = new PrismaProductRepository();
  const cartRepository = new PrismaCartRepository();
  const orderRepository = new PrismaOrderRepository();

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

  // Cart Use Cases
  const addItemToCartUseCase = new AddItemToCartUseCase(
    cartRepository,
    productRepository,
  );
  const getCartUseCase = new GetCartUseCase(cartRepository);
  const removeCartItemUseCase = new RemoveCartItemUseCase(cartRepository);

  // Order Use Cases
  // Order Use Cases
  const checkoutUseCase = new CheckoutUseCase(orderRepository);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(
    orderRepository,
  );
  // Controllers
  const adminController = new AdminController();
  const orderController = new OrderController(
    checkoutUseCase,
    orderRepository,
    updateOrderStatusUseCase,
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

  const cartController = new CartController(
    addItemToCartUseCase,
    getCartUseCase,
    removeCartItemUseCase,
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
  const cartRoutes = createCartRoutes(cartController, authMiddleware);

  const orderRoutes = createOrderRoutes(orderController, authMiddleware);
  return {
    userRoutes,
    authRoutes,
    adminRoutes,
    categoryRoutes,
    productRoutes,
    cartRoutes,
    orderRoutes,
    authMiddleware,
  };
}
