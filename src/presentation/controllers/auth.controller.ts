import type { Request, Response, NextFunction } from "express";

import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case.js";
import { LoginUseCase } from "../../application/use-cases/auth/login.use-case.js";
import { GetUserByIdUseCase } from "../../application/use-cases/user/get-user-by-id.use-case.js";
import { toUserResponseDto } from "../dtos/user-response.dto.js";

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
      const user = await this.registerUseCase.execute(req.body);

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
      const result = await this.loginUseCase.execute(req.body);

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
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.auth.userId;
      const user = await this.getUserByIdUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };
}
