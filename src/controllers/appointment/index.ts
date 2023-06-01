import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId, WithoutId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { AddAppointmentBody, Appointment } from "../../models/appointment";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const addAppointment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const data: AddAppointmentBody = req.joiValue;

      const currentPatientId: ObjectId = req.currentUser._id;

      // Look for the last Token in the schema and registering the next one
      const token = 4;

      const newAppointment: WithoutId<Appointment> = {
        patientId: currentPatientId,
        department: data.department,
        status: data.status,
        time: data.time,
        tokenNumber: token,
      };

      const insertedData: WithId<Appointment> = {
        _id: new ObjectId(),
        ...newAppointment,
      };

      const result: InsertOneResult<WithId<Appointment>> =
        await DBCollections.appointment.insertOne(insertedData);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const response: ResponseObject = {
        status: "success",
        code: "created",
        message: "Appointment is booked successfully",
        items: newAppointment,
      };

      res.status(201).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Get appointment function

export const getAppointments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointments: WithId<Appointment>[] =
        await DBCollections.appointment.find({}).toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Appointments Fetched",
        items: appointments,
      };

      res.status(200).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
