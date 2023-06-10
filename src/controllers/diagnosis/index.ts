import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Diagnosis } from "../../models/prescription";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const addDiagnosis = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 403)
      );
    }

    const data: Diagnosis = req.joiValue;

    const insertedData: WithId<Diagnosis> = {
      _id: new ObjectId(),
      ...data,
    };

    const result: InsertOneResult<WithId<Diagnosis>> =
      await DBCollections.diagnosis.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Diagnosis is added successfully",
      items: insertedData,
    };

    res.status(201).json(response);
  }
);

export const getDiagnosis = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const diagnosis: WithId<Diagnosis>[] = await DBCollections.diagnosis
      .find()
      .toArray();

    const response: ResponseObject = {
      code: "fetched",
      status: "success",
      message: "All diagnosis fetched",
      items: diagnosis,
    };
  }
);
