import type { Request, Response, NextFunction } from "express";

import { CheckoutUseCase } from "../../application/use-cases/order/checkout.use-case.js";
import { UpdateOrderStatusUseCase } from "../../application/use-cases/order/update-order-status.use-case.js";
import type { OrderRepository } from "../../domain/repositories/order.repository.js";
import { toOrderResponseDto } from "../dtos/order-response.dto.js";

export class OrderController {
  constructor(
    private readonly checkoutUseCase: CheckoutUseCase,
    private readonly orderRepository: OrderRepository,
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
      const orders = await this.orderRepository.findByUserId(userId);

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

      const order = await this.orderRepository.findById(orderId);

      if (!order || order.userId !== userId) {
        res.status(404).json({
          success: false,
          message: "Order not found",
        });
        return;
      }

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
