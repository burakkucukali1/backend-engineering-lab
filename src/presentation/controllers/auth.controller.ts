import type { Request, Response, NextFunction } from "express";

import { RegisterUseCase } from "../../application/use-cases/auth/register.use-case.js";
import { registerSchema } from "../validators/auth.validator.js";
import { toUserResponseDto } from "../dtos/user-response.dto.js";

export class AuthController {
  constructor(private readonly registerUseCase: RegisterUseCase) {}

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
}
