import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { Db, InsertOneResult, ObjectId, WithId, WithoutId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Appointment } from "../../models/appointment";
import { Doctor } from "../../models/doctor";
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

      const newOpd: WithoutId<Opd> = {
        currentToken: 101,
        date: new Date(),
        departmentId: body.departmentId,
        expectedTimeToNext: new Date(),
        inQueue: 0,
        lastToken: 100,
        status: "Idle",
        currentAppointment: null,
        nextAppointment: null,
        doctorId: null,
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

// Get opds function to fetch all opds

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

// Get active opds to query all the opds having status start

export const getActiveOpds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opds: WithId<Opd>[] = await DBCollections.opd
        .find({ status: "Start" })
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Started opds  Fetched",
        items: opds,
      };

      res.status(200).json(response);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Join Opd function that will call for a doctor to join opd
export const joinOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const currentUser = req.currentUser;

      // Fetching the doctor id

      const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne(
        {
          cnic: currentUser.cnic,
        }
      );

      const opdId = req.params.id;

      if (!ObjectId.isValid(opdId)) {
        return next(
          new AppError(
            "invalid_req_params",
            "Opd id must be a vlid mongodb Object id",
            400
          )
        );
      }

      // Fetching the opd infor that it exists
      const checkOpd: WithId<Opd> | null = await DBCollections.opd.findOne({
        _id: new ObjectId(opdId),
      });

      if (!checkOpd) {
        return next(
          new AppError("opd_not_found", "Opd not founded with this id", 404)
        );
      }

      if (checkOpd.doctorId != null) {
        return next(
          new AppError(
            "doctor_already_assigned",
            "A doctor is currently working in this opd",
            400
          )
        );
      }
      // Updated the opd to Joined
      const opd = await DBCollections.opd.updateOne(
        { _id: new ObjectId(opdId) },
        {
          $set: {
            status: "Start",
            doctorId: new ObjectId(doctor?._id),
          },
        }
      );

      const resposne: ResponseObject = {
        code: "opd_joined",
        status: "success",
        message: "Opd joined successfully",
      };
      return res.status(200).json(resposne);
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
// Leave Opd function that will call when doctor leave opd
export const leaveOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = req.currentUser;

    // Fetching the doctor id

    const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne({
      cnic: currentUser.cnic,
    });

    const opdId = req.params.id;

    if (!ObjectId.isValid(opdId)) {
      return next(
        new AppError(
          "invalid_req_params",
          "Opd id must be a vlid mongodb Object id",
          400
        )
      );
    }

    // Fetching the opd to compare it with the doctorid

    const checkOpd: WithId<Opd> | null = await DBCollections.opd.findOne({
      _id: new ObjectId(opdId),
    });

    if (!checkOpd) {
      return next(
        new AppError("opd_not_found", "Opd not found with provided id", 404)
      );
    }

    if (checkOpd.doctorId?.toString() != doctor?._id.toString()) {
      console.log({
        previous: checkOpd.doctorId,
        current: doctor?._id,
        result: checkOpd.doctorId != doctor?._id,
      });
      return next(
        new AppError(
          "unauthorized",
          "You do not have the access to leave this opd",
          404
        )
      );
    }
    // Updated the opd to Joined
    const opd = await DBCollections.opd.updateOne(
      { _id: new ObjectId(opdId) },
      {
        $set: {
          status: "Idle",
          doctorId: null,
        },
      }
    );

    const resposne: ResponseObject = {
      code: "opd_left",
      status: "success",
      message: "Opd left successfully",
    };
    return res.status(200).json(resposne);
  }
);

// Leave Opd function that will call when doctor leave opd
export const stopOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const opdId = req.params.id;

    // Update the opd to Joined
    const opd = await DBCollections.opd.updateOne(
      { _id: new ObjectId(opdId) },
      {
        $set: {
          status: "Closed",
        },
      }
    );

    const resposne: ResponseObject = {
      code: "opd_left",
      status: "success",
      message: "Opd Closed  successfully",
    };
    return res.status(200).json(resposne);
  }
);

// Load currentPatient

export const getCurrentAppointmentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Utility functions

export const deleteAllOpds = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    DBCollections.opd.deleteMany({});
  }
);
