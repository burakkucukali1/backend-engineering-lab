import type { Request, Response, NextFunction } from "express";

import { CreateUserUseCase } from "../../application/use-cases/user/create-user.use-case.js";

import { createUserSchema } from "../validators/user.validator.js";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
  ) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validatedData = createUserSchema.parse(req.body);

      const user = await this.createUserUseCase.execute(validatedData);

      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };
}