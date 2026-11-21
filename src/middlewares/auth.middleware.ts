import type { Request, Response, NextFunction } from "express";
import type { TokenService } from "../application/ports/token-service.js";
import type { UserRepository } from "../domain/repositories/user.repository.js";

export function createAuthMiddleware(
  tokenService: TokenService,
  userRepository: UserRepository,
) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
      return;
    }

    let payload;

    try {
      const token = authorization.slice(7);
      payload = await tokenService.verifyAccessToken(token);
    } catch {
      res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
      return;
    }

    try {
      const user = await userRepository.findById(payload.userId);

      if (!user) {
        res.status(401).json({
          success: false,
          message: "User no longer exists",
        });
        return;
      }

      res.locals.auth = {
        userId: user.id,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
