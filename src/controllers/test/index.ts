import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Test } from "../../models/prescription";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const AddTest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 403)
      );
    }

    const data: Test = req.joiValue;

    const insertedData: WithId<Test> = {
      _id: new ObjectId(),
      ...data,
    };

    const result: InsertOneResult<WithId<Test>> =
      await DBCollections.test.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Test is added successfully",
      items: insertedData,
    };

    res.status(201).json(response);
  }
);

// get test that will return all the tests in the database

export const getTest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tests: WithId<Test>[] = await DBCollections.test.find().toArray();

    const response: ResponseObject = {
      code: "test_fetched",
      status: "success",
      message: "All test fetched",
      items: tests,
    };

    return res.status(200).json(response);
  }
);
