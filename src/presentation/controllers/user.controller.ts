import type { Request, Response, NextFunction } from "express";

import { CreateUserUseCase } from "../../application/use-cases/user/create-user.use-case.js";

import { createUserSchema } from "../validators/user.validator.js";
import { GetUserByIdUseCase } from "../../application/use-cases/user/get-user-by-id.use-case.js";
import { GetUsersUseCase } from "../../application/use-cases/user/get-users.use-case.js";
import { toUserResponseDto } from "../dtos/user-response.dto.js";
import { paginationSchema } from "../validators/user.validator.js";
import { UpdateUserUseCase } from "../../application/use-cases/user/update-user.use-case.js";
import { updateUserSchema } from "../validators/user.validator.js";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
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

  getById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const user = await this.getUserByIdUseCase.execute(id);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  getAll = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page, limit } = paginationSchema.parse(req.query);

      const result = await this.getUsersUseCase.execute({
        page,
        limit,
      });

      res.status(200).json({
        success: true,
        data: result.users.map(toUserResponseDto),
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  };

  update = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = Number(req.params.id);

      if (!Number.isInteger(id) || id <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const validatedData = updateUserSchema.parse(req.body);

      const user = await this.updateUserUseCase.execute(id, validatedData);

      res.status(200).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };
}
