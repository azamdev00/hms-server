import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId, WithoutId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { AddOpdBody, Opd } from "../../models/opd";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const addOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const body: AddOpdBody = req.joiValue;

      const doctorId: ObjectId = req.currentUser._id;

      const newOpd: WithoutId<Opd> = {
        canceled: [],
        currentToken: 101,
        date: new Date(),
        departmentId: body.departmentId,
        doctorId: doctorId,
        expectedTimeToNext: new Date(),
        inQueue: 0,
        lastToken: 0,
        status: "Start",
        totalCanceled: 0,
        treated: 0,
      };

      const insertedData: WithId<Opd> = {
        _id: new ObjectId(),
        ...newOpd,
      };

      const result: InsertOneResult<WithId<Opd>> =
        await DBCollections.opd.insertOne(insertedData);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const response: ResponseObject = {
        status: "success",
        code: "created",
        message: "Opd is started successfully",
        items: newOpd,
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Get opds

export const getOpds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opds: WithId<Opd>[] = await DBCollections.opd.find({}).toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Opds Fetched",
        items: opds,
      };

      res.status(200).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// NextOpd  for doctor to next Patient

export const nextOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
