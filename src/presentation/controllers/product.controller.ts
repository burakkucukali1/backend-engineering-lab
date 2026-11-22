import type { Request, Response, NextFunction } from "express";

import type { CreateProductUseCase } from "../../application/use-cases/product/create-product.use-case.js";
import type { GetProductByIdUseCase } from "../../application/use-cases/product/get-product-by-id.use-case.js";
import type { GetProductsUseCase } from "../../application/use-cases/product/get-products.use-case.js";
import type { UpdateProductUseCase } from "../../application/use-cases/product/update-product.use-case.js";

export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
  ) {}

  create = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const product = await this.createProductUseCase.execute(req.body);

      res.status(201).json({ success: true, data: product });
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
      const product = await this.getProductByIdUseCase.execute(
        res.locals.validatedParams.id,
      );

      res.status(200).json({ success: true, data: product });
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

      const result = await this.getProductsUseCase.execute(page, limit);

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
      const product = await this.updateProductUseCase.execute(
        res.locals.validatedParams.id,
        req.body,
      );

      res.status(200).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };
}
