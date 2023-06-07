import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import AppError from "../../utils/AppError";

export const addPrescription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

export const getPrescription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
