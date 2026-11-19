import type { Request, Response, NextFunction } from "express";

const loggerMiddleware = (
    req: Request,
    _res: Response,
    next: NextFunction
): void => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl}`);
  next();
}

export default loggerMiddleware;