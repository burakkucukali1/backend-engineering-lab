import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

function handleValidation(
  result: ReturnType<ZodType["safeParse"]>,
  req: Request,
  res: Response,
  next: NextFunction,
  target: "body" | "params" | "query",
): void {
  if (!result.success) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (target === "body") req.body = result.data;
  if (target === "params") res.locals.validatedParams = result.data;
  if (target === "query") res.locals.validatedQuery = result.data;

  next();
}

export function validateBody<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) =>
    handleValidation(schema.safeParse(req.body), req, res, next, "body");
}

export function validateParams<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) =>
    handleValidation(schema.safeParse(req.params), req, res, next, "params");
}

export function validateQuery<T extends ZodType>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) =>
    handleValidation(schema.safeParse(req.query), req, res, next, "query");
}
