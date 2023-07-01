import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { Admin } from "../../models/admin";
import DBCollections from "../../config/DBCollections";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";
import { getSafeObject } from "../../utils/get.safe.object";
import { ResponseObject } from "../../models/response.model";
import bcrypt from "bcrypt";

export const addAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );
    }

    const data: Admin = req.joiValue;

    // Checking admin exists with cnic
    const isAdminFound: WithId<Admin> | null =
      await DBCollections.admin.findOne({ cnic: data.cnic });

    if (isAdminFound)
      return next(
        new AppError("cnic_already_taken", "Cnic is already registered", 409)
      );

    const hashedPassword: string = await bcrypt.hash(data.password, 12);

    const insertedData: WithId<Admin> = {
      _id: new ObjectId(),
      ...data,
      password: hashedPassword,
    };

    const result: InsertOneResult<WithId<Admin>> =
      await DBCollections.admin.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const safeObject = getSafeObject(insertedData, ["password"]);

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Admin is added successfully",
      items: safeObject,
    };

    res.status(201).json(response);
  }
);
