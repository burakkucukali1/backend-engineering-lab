import type { Request, Response, NextFunction } from "express";

import type { CreateUserData } from "../../domain/repositories/user.repository.js";
import { CreateUserUseCase } from "../../application/use-cases/user/create-user.use-case.js";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  create = async (
    req: Request<{}, {}, CreateUserData>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.createUserUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}