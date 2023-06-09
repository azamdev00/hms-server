import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Medicine } from "../../models/prescription";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const addMedicine = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 403)
      );
    }

    const data: Medicine = req.joiValue;

    const isFind: WithId<Medicine> | null =
      await DBCollections.medicines.findOne({
        name: data.name,
        amount: data.amount,
        measures: data.measures,
      });

    if (isFind) {
      return next(
        new AppError(
          "medicine_already_exists",
          "Medicine already exists with this compositions",
          409
        )
      );
    }

    const insertedData: WithId<Medicine> = {
      _id: new ObjectId(),
      ...data,
    };

    const result: InsertOneResult<WithId<Medicine>> =
      await DBCollections.medicines.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Medicine is added successfully",
      items: data,
    };

    res.status(201).json(response);
  }
);

// Get medicine function to get all medicine

export const getMedicins = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const medicines: WithId<Medicine>[] = await DBCollections.medicines
      .find()
      .toArray();

    const response: ResponseObject = {
      code: "medicine_fetched",
      status: "success",
      message: "All medicines fetched",
      items: { medicines: medicines },
    };
  }
);
