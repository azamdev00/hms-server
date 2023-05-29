import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { catchAsync } from "../../utils/catch.async";
import DBCollections from "../../config/DBCollections";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { Patient } from "../../models/patient";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { getSafeObject } from "../../utils/get.safe.object";

export const getAllPatients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients: Patient[] = await DBCollections.patients
        .find({})
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Countries Fetched",
        items: patients,
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

export const addPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError)
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );

    const data: Patient = req.joiValue;

    const isFind: Patient | null = await DBCollections.patients.findOne({
      cnic: data.cnic,
    });

    if (isFind)
      return next(
        new AppError("duplicate_key", "Cnic is already registered", 409)
      );

    const hashedPassword: string = await bcrypt.hash(data.password, 12);

    const insertedData: WithId<Patient> = {
      _id: new ObjectId(),
      ...data,
      password: hashedPassword,
    };

    const result: InsertOneResult<Patient> =
      await DBCollections.patients.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const safeObject = getSafeObject(data, ["password"]);

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Patient is added successfully",
      items: safeObject,
    };

    res.status(201).json(response);
  }
);
