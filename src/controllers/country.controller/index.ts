import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import DBCollections from "../../config/DBCollections";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";

export const getAllCountries = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const countryList = await DBCollections.countries.find({}).toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Countries Fetched",
        data: countryList,
      };

      res.status(200).json(response);
    } catch (error: any) {
      console.log(error);
      return next(
        new AppError("server_error", error?.message, error?.statusCode)
      );
    }
  }
);
