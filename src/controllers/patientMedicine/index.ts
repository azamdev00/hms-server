import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { PatientMedicine } from "../../models/prescription";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

// Add patient medicine to create patient medicine
export const addPatientMedicine = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 403)
      );
    }

    const data: PatientMedicine = req.joiValue;

    const insertedData: WithId<PatientMedicine> = {
      _id: new ObjectId(),
      ...data,
    };

    const result: InsertOneResult<WithId<PatientMedicine>> =
      await DBCollections.patientMedicines.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const response: ResponseObject = {
      status: "success",
      code: "created",
      message: "Department is added successfully",
      items: data,
    };

    res.status(201).json(response);
  }
);

// Get PatientMedicine Function to query all patient medicines
export const getPatientMedicine = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientMedicines: WithId<PatientMedicine>[] =
      await DBCollections.patientMedicines.find().toArray();

    const response: ResponseObject = {
      code: "patient_medicine_fetched",
      status: "success",
      message: "All patient medicine fetched",
      items: {
        patientMedicines: patientMedicines,
      },
    };
  }
);
