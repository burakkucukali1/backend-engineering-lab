import type { Request, Response, NextFunction } from "express";
import type { TokenService } from "../application/ports/token-service.js";

export function createAuthMiddleware(tokenService: TokenService) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const authorization = req.headers.authorization;

      if (!authorization?.startsWith("Bearer ")) {
        res.status(401).json({
          success: false,
          message: "Authentication token is required",
        });
        return;
      }

      const token = authorization.slice(7);
      const payload = await tokenService.verifyAccessToken(token);

      res.locals.auth = payload;
      next();
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }
  };
}
