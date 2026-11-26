import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import { UserAlreadyExistsError } from "../application/errors/user-already-exists.error.js";
import { UserNotFoundError } from "../application/errors/user-not-found.error.js";
import { OrderNotFoundError } from "../application/errors/order-not-found.error.js";
import { InvalidCredentialsError } from "../application/errors/invalid-credentials.error.js";
import { CheckoutConflictError } from "../application/errors/checkout-conflict.error.js";

export function errorMiddleware(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (
    error instanceof UserAlreadyExistsError ||
    error instanceof CheckoutConflictError
  ) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (
    error instanceof UserNotFoundError ||
    error instanceof OrderNotFoundError
  ) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof InvalidCredentialsError) {
    res.status(401).json({
      success: false,
      message: error.message,
    });
    return;
  }

  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
