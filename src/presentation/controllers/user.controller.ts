import type { Request, Response, NextFunction } from "express";

import { CreateUserUseCase } from "../../application/use-cases/user/create-user.use-case.js";
import { GetUserByIdUseCase } from "../../application/use-cases/user/get-user-by-id.use-case.js";
import { GetUsersUseCase } from "../../application/use-cases/user/get-users.use-case.js";
import { UpdateUserUseCase } from "../../application/use-cases/user/update-user.use-case.js";
import { toUserResponseDto } from "../dtos/user-response.dto.js";

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
      const user = await this.createUserUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.getUserByIdUseCase.execute(
        res.locals.validatedParams.id,
      );

      res.status(200).json({
        success: true,
        data: toUserResponseDto(user),
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
      const { page, limit } = res.locals.validatedQuery;

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
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.updateUserUseCase.execute(
        res.locals.validatedParams.id,
        req.body,
      );

      res.status(200).json({
        success: true,
        data: toUserResponseDto(user),
      });
    } catch (error) {
      next(error);
    }
  };
}
