import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId, WithoutId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { AddAppointmentBody, Appointment } from "../../models/appointment";
import { Opd } from "../../models/opd";
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

      // Look for    the last Token in the schema and registering the next one

      const opd: WithId<Opd> | null = await DBCollections.opd.findOne({
        _id: new ObjectId(data.opdId.toString()),
      });

      if (!opd) {
        return next(
          new AppError(
            "opd_not_found",
            "Opd not founded with the provided id",
            404
          )
        );
      }

      // Now searching the appointments and getting the last one id
      const appointments: WithId<Appointment>[] | null =
        await DBCollections.appointment
          .find({ opdId: new ObjectId(data.opdId) })
          .sort({ tokenNumber: -1 })
          .toArray();

      let token = 101;

      if (appointments.length !== 0)
        token = Number(appointments[0].tokenNumber) + 1;
      const newAppointment: WithoutId<Appointment> = {
        patientId: currentPatientId,
        opdId: new ObjectId(data.opdId),
        status: data.status,
        time: data.time,
        tokenNumber: token,
        fromTime: data.fromTime,
        toTime: data.toTime,
      };

      // Inserting new appointment
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
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Get appointments function to fetch all appointments
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

export const getAppoint = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const appointment: WithId<Appointment> | null =
      await DBCollections.appointment.findOne({ _id: new ObjectId(id) });
    if (!appointment) {
      return next(
        new AppError(
          "appointment_not_found",
          "Appointment not founded with the provided id",
          404
        )
      );
    }

    const response: ResponseObject = {
      code: "appointment_fetched",
      status: "success",
      message: "Appointment fetched",
      items: {
        appointment: appointment,
      },
    };

    return res.status(200).json(response);
  }
);
