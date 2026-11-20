import express from "express";

import { createContainer } from "./container.js";

import healthRoutes from "./routes/health.routes.js";
import loggerMiddleware from "./middlewares/logger.middleware.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

// Dependency Injection
const container = createContainer();

// Global middleware
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use("/health", healthRoutes);
app.use("/users", container.userRoutes);

// Error handling
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;