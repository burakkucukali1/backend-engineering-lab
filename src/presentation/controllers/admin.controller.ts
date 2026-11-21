import type { Request, Response } from "express";

export class AdminController {
  dashboard = (req: Request, res: Response): void => {
    res.status(200).json({
      success: true,
      message: "Welcome to the admin dashboard",
      data: {
        userId: res.locals.auth.userId,
        email: res.locals.auth.email,
        role: res.locals.auth.role,
      },
    });
  };
}
