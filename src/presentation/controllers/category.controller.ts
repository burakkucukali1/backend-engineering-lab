import type { Request, Response, NextFunction } from "express";

import type { CreateCategoryUseCase } from "../../application/use-cases/category/create-category.use-case.js";
import type { GetCategoryByIdUseCase } from "../../application/use-cases/category/get-category-by-id.use-case.js";
import type { GetCategoriesUseCase } from "../../application/use-cases/category/get-categories.use-case.js";
import type { UpdateCategoryUseCase } from "../../application/use-cases/category/update-category.use-case.js";
import { toCategoryResponseDto } from "../dtos/category-response.dto.js";

export class CategoryController {
  constructor(
    private readonly createCategoryUseCase: CreateCategoryUseCase,
    private readonly getCategoryByIdUseCase: GetCategoryByIdUseCase,
    private readonly getCategoriesUseCase: GetCategoriesUseCase,
    private readonly updateCategoryUseCase: UpdateCategoryUseCase,
  ) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const category = await this.createCategoryUseCase.execute(req.body);

      res.status(201).json({
        success: true,
        data: toCategoryResponseDto(category),
      });
    } catch (error) {
      next(error);
    }
  };

  findById = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const category = await this.getCategoryByIdUseCase.execute(
        res.locals.validatedParams.id,
      );

      res.status(201).json({
        success: true,
        data: toCategoryResponseDto(category),
      });
    } catch (error) {
      next(error);
    }
  };

  findAll = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { page, limit } = res.locals.validatedQuery;

      const result = await this.getCategoriesUseCase.execute(page, limit);

      res.status(200).json({ success: true, ...result });
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
      const category = await this.updateCategoryUseCase.execute(
        res.locals.validatedParams.id,
        req.body,
      );

      res.status(201).json({
        success: true,
        data: toCategoryResponseDto(category),
      });
    } catch (error) {
      next(error);
    }
  };
}
