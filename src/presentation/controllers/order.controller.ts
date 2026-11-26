import type { Request, Response, NextFunction } from "express";

import { CheckoutUseCase } from "../../application/use-cases/order/checkout.use-case.js";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/order/update-order-status.use-case.js";
import { GetMyOrdersUseCase } from "../../application/use-cases/order/get-my-orders.use-case.js";
import { GetOrderByIdUseCase } from "../../application/use-cases/order/get-order-by-id.use-case.js";

import { toOrderResponseDto } from "../dtos/order-response.dto.js";

export class OrderController {
  constructor(
    private readonly checkoutUseCase: CheckoutUseCase,
    private readonly getMyOrdersUseCase: GetMyOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {}

  checkout = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.auth.userId as number;
      const order = await this.checkoutUseCase.execute(userId);

      res.status(201).json({
        success: true,
        data: toOrderResponseDto(order),
      });
    } catch (error) {
      next(error);
    }
  };

  getMyOrders = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.auth.userId as number;
      const orders = await this.getMyOrdersUseCase.execute(userId);

      res.status(200).json({
        success: true,
        data: orders.map(toOrderResponseDto),
      });
    } catch (error) {
      next(error);
    }
  };

  getOrderById = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const userId = res.locals.auth.userId as number;
      const orderId = Number(req.params.id);

      if (!Number.isInteger(orderId) || orderId <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
        return;
      }

      const order = await this.getOrderByIdUseCase.execute(orderId, userId);

      res.status(200).json({
        success: true,
        data: toOrderResponseDto(order),
      });
    } catch (error) {
      next(error);
    }
  };

  updateStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const orderId = Number(req.params.id);
      const { status } = req.body;

      if (!Number.isInteger(orderId) || orderId <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
        return;
      }

      const order = await this.updateOrderStatusUseCase.execute({
        orderId,
        status,
      });

      res.status(200).json({
        success: true,
        data: toOrderResponseDto(order),
      });
    } catch (error) {
      next(error);
    }
  };
}
