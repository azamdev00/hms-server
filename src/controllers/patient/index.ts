import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import { catchAsync } from "../../utils/catch.async";
import DBCollections from "../../config/DBCollections";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { Patient } from "../../models/patient";
import { getSafeObject } from "../../utils/get.safe.object";
import { Appointment } from "../../models/appointment";
import { Prescription } from "../../models/prescription";
import { resolve } from "path";
import { rejects } from "assert";

export const getAllPatients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const patients: WithId<Patient>[] = await DBCollections.patients
        .find({})
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Patients Fetched",
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
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const data: Patient = req.joiValue;

      const isFind: WithId<Patient> | null =
        await DBCollections.patients.findOne({
          cnic: data.cnic,
        });

      if (isFind)
        return next(
          new AppError("cnic_already_taken", "Cnic is already registered", 409)
        );

      const hashedPassword: string = await bcrypt.hash(data.password, 12);

      const insertedData: WithId<Patient> = {
        _id: new ObjectId(),
        ...data,
        password: hashedPassword,
      };

      const result: InsertOneResult<WithId<Patient>> =
        await DBCollections.patients.insertOne(insertedData);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const safeObject = getSafeObject(insertedData, ["password"]);

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

// Get patient history

export const getPatientHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const patientId = req.params.id;

    const appointment = await getPatientWithAppointments(patientId);

    return res.json(appointment);
  }
);

export const getPatientWithAppointments = (patientId: string | ObjectId) => {
  return new Promise(async (resolve, rejects) => {
    const patient: WithId<Patient> | null =
      await DBCollections.patients.findOne({ _id: new ObjectId(patientId) });

    if (patient == null) rejects("Patient record not found");
    else {
      const appointments: WithId<Appointment>[] =
        await DBCollections.appointment
          .find({ patientId: patient._id })
          .toArray();

      resolve(appointments);
    }
  });
};
