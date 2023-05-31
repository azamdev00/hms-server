import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Department } from "../../models/department";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const getAllDepartments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const departments: WithId<Department>[] = await DBCollections.departments
        .find({})
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Departments Fetched",
        items: departments,
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

// Department controller

export const addDeparment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const data: Department = req.joiValue;

      const isFind: WithId<Department> | null =
        await DBCollections.departments.findOne({
          name: data.name,
        });

      if (isFind)
        return next(
          new AppError(
            "department_name_already_taken",
            "Department is already registered",
            409
          )
        );

      const insertedData: WithId<Department> = {
        _id: new ObjectId(),
        ...data,
      };

      const result: InsertOneResult<WithId<Department>> =
        await DBCollections.departments.insertOne(insertedData);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const response: ResponseObject = {
        status: "success",
        code: "created",
        message: "Department is added successfully",
        items: data,
      };

      res.status(201).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
