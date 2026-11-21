import type { Request, Response, NextFunction } from "express";

import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case.js";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case.js";
import { registerSchema } from "../validators/auth.validator.js";
import { loginSchema } from "../validators/login.validator.js";
import { toUserResponseDto } from "../dtos/user-response.dto.js";
import { GetUserByIdUseCase } from "../../application/use-cases/user/get-user-by-id.use-case.js";

export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData = registerSchema.parse(req.body);

      const user = await this.registerUseCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await this.loginUseCase.execute(validatedData);

      res.status(200).json({
        success: true,
        data: {
          user: toUserResponseDto(result.user),
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  me = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.auth.userId;
      const user = await this.getUserByIdUseCase.execute(userId);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };
}
