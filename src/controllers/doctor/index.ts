import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { catchAsync } from "../../utils/catch.async";
import DBCollections from "../../config/DBCollections";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { getSafeObject } from "../../utils/get.safe.object";
import { Doctor } from "../../models/doctor";

export const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const doctors: WithId<Doctor>[] = await DBCollections.doctors
        .find({})
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Doctors Fetched",
        items: doctors,
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

export const addDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const data: Doctor = req.joiValue;

      const isFind: WithId<Doctor> | null = await DBCollections.doctors.findOne(
        {
          cnic: data.cnic,
        }
      );

      if (isFind)
        return next(
          new AppError("cnic_already_taken", "Cnic is already registered", 409)
        );

      const hashedPassword: string = await bcrypt.hash(data.password, 12);

      const insertedData: WithId<Doctor> = {
        _id: new ObjectId(),
        ...data,
        password: hashedPassword,
      };

      const result: InsertOneResult<WithId<Doctor>> =
        await DBCollections.doctors.insertOne(insertedData);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const safeObject = getSafeObject(data, ["password"]);

      const response: ResponseObject = {
        status: "success",
        code: "created",
        message: "Patient is added successfully",
        items: safeObject,
      };

      res.status(201).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
