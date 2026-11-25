import type { Request, Response, NextFunction } from "express";

import type { AddItemToCartUseCase } from "../../application/use-cases/cart/add-item-to-cart.use-case.js";
import type { GetCartUseCase } from "../../application/use-cases/cart/get-cart.use-case.js";
import type { RemoveCartItemUseCase } from "../../application/use-cases/cart/remove-cart-item.use-case.js";

import { toCartResponseDto } from "../dtos/cart-response.dto.js";

export class CartController {
  constructor(
    private readonly addItemToCartUseCase: AddItemToCartUseCase,
    private readonly getCartUseCase: GetCartUseCase,
    private readonly removeCartItemUseCase: RemoveCartItemUseCase,
  ) {}

  getCart = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cart = await this.getCartUseCase.execute(res.locals.auth.userId);

      res.status(200).json({
        success: true,
        data: cart ? toCartResponseDto(cart) : null,
      });
    } catch (error) {
      next(error);
    }
  };

  addItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const cart = await this.addItemToCartUseCase.execute({
        userId: res.locals.auth.userId,
        productId: req.body.productId,
        quantity: req.body.quantity,
      });

      res.status(200).json({
        success: true,
        data: toCartResponseDto(cart),
      });
    } catch (error) {
      next(error);
    }
  };

  removeItem = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      await this.removeCartItemUseCase.execute({
        userId: res.locals.auth.userId,
        productId: Number(req.params.productId),
      });

      res.status(200).json({
        success: true,
        message: "Cart item removed successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
