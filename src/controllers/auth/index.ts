import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";

export const patientLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {}
);
