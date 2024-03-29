import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { Db, InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Appointment } from "../../models/appointment";
import { Doctor } from "../../models/doctor";
import { AddOpdBody, assignDoctorBody, Opd } from "../../models/opd";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";
import { Department } from "../../models/department";

export const addOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const joiError: ValidationError = req.joiError;

      if (joiError)
        return next(
          new AppError("invalid_req_body", joiError.details[0].message, 400)
        );

      const body: AddOpdBody = req.joiValue;

      const department = await DBCollections.departments.findOne({
        _id: new ObjectId(body.departmentId),
      });

      const newOpd: WithId<Opd> = {
        _id: new ObjectId(),
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
        // assignedDoctor: body.assignedDoctor,
      };

      const result: InsertOneResult<WithId<Opd>> =
        await DBCollections.opd.insertOne(newOpd);

      if (!result.acknowledged)
        return next(
          new AppError("server_error", "Please try again later", 502)
        );

      const opd = {
        ...newOpd,
        department,
      };

      const response: ResponseObject = {
        status: "success",
        code: "created",
        message: "Opd is started successfully",
        items: opd,
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
      const { skip } = req.body;
      const opds: WithId<Opd>[] = await DBCollections.opd
        .find({})
        .limit(20)
        .skip(skip ?? 0)
        .sort({ date: -1 })
        .toArray();

      const doctors: WithId<Doctor>[] = await DBCollections.doctors
        .find()
        .toArray();
      const departments: WithId<Department>[] = await DBCollections.departments
        .find()
        .toArray();

      const filterOpd = opds.map(async (opd: Opd) => {
        const department = departments.find(
          (depart: WithId<Department>) =>
            depart._id.toString() === opd.departmentId.toString()
        );

        let doctor: Doctor | undefined;
        if (opd.doctorId)
          doctor = doctors.find(
            (doc) => doc._id.toString() === opd.doctorId?.toString()
          );

        return { ...opd, department, doctor };
      });

      Promise.all(filterOpd).then((data) => {
        const response: ResponseObject = {
          code: "ok",
          status: "success",
          message: "All Opds Fetched",
          items: data,
          doctors,
          departments,
        };

        res.status(200).json(response);
      });
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Get active opds to query all the opds having status start

export const getActiveOpds = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const today = new Date();
      const todayDay = today.getDate();

      const opds = await DBCollections.opd
        .aggregate([
          {
            $match: {
              status: { $in: ["Start", "Idle"] },
              $expr: {
                $eq: [{ $dayOfMonth: "$date" }, todayDay],
              },
            },
          },
        ])
        .toArray();

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "All Started opds  Fetched",
        items: opds,
      };

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

export const changeOpdStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, id } = req.body;

      const result = await DBCollections.opd.updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: status } }
      );

      if (!result.modifiedCount)
        return next(
          new AppError("server_error", "Please try again later", 500)
        );

      const response: ResponseObject = {
        code: "ok",
        status: "success",
        message: "OPD status change successfully",
      };

      res.status(203).json(response);
    } catch (error) {
      console.log(error);
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

      // Fetching the opd infor that it exists
      const checkOpd: WithId<Opd> | null = await DBCollections.opd.findOne({
        _id: new ObjectId(opdId),
      });

      if (!checkOpd) {
        return next(
          new AppError("opd_not_found", "Opd not founded with this id", 404)
        );
      }

      // Updated the opd to Joined
      await DBCollections.opd.updateOne(
        { _id: new ObjectId(opdId) },
        {
          $set: {
            status: "Start",
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

//stop OPD function that will call when the opd stopped
export const stopOpd = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const opdId = req.params.id;

    // Update the opd to Joined
    const opd = await DBCollections.opd.updateOne(
      { _id: new ObjectId(opdId) },
      {
        $set: {
          status: "Stopped",
        },
      }
    );

    const resposne: ResponseObject = {
      code: "opd_left",
      status: "success",
      message: "Opd Closed successfully",
    };
    return res.status(200).json(resposne);
  }
);

// NextPatient to load the next patient as a current
export const nextPateient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1. Finding the opd
    // 2. Searching for the queue of the appointments
    // 3. If there is appointments in the queue and the current token is null then loading this

    const opdId = req.params.id;
    // Fetching opd
    const opd: WithId<Opd> | null = await DBCollections.opd.findOne({
      _id: new ObjectId(opdId),
    });

    if (!opd) {
      return next(
        new AppError("opd_not_found", "Opd not found with the provided id", 404)
      );
    }

    const appointments: WithId<Appointment>[] = await DBCollections.appointment
      .find({ opdId: new ObjectId(opdId), status: "Waiting" })
      .sort({ tokenNumber: 1 })
      .toArray();

    if (appointments.length === 0) {
      console.log("No waiting patients");
      console.log(appointments);

      opd.currentAppointment = null;
      opd.nextAppointment = null;
      opd.inQueue = 0;

      await DBCollections.opd.findOneAndUpdate(
        { _id: new ObjectId(opdId) },
        {
          $set: { currentAppointment: null, nextAppointment: null, inQueue: 0 },
        }
      );

      const response: ResponseObject = {
        code: "pateint_queue_empty",
        status: "success",
        message: "No more patients in the queue",
        items: { opd: opd },
      };

      return res.status(200).json(response);
    }

    opd.inQueue = appointments.length;
    opd.currentAppointment = appointments[0]._id;
    if (appointments.length === 1) {
      opd.nextAppointment = null;
    }

    if (appointments.length > 1) {
      opd.nextAppointment = appointments[1]._id;
    }

    await DBCollections.opd.findOneAndUpdate(
      { _id: new ObjectId(opdId) },
      {
        $set: {
          nextAppointment: opd.nextAppointment,
          currentAppointment: opd.currentAppointment,
          inQueue: opd.inQueue,
        },
      }
    );

    const response: ResponseObject = {
      code: "next_appointment_loaded",
      status: "success",
      message: "Next patient details fetched",
      items: {
        opd: opd,
        currentAppointment: appointments[0],
      },
    };

    return res.status(200).json(response);
  }
);

// Load currentPatient

export const getCurrentAppointmentDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const opdId = req.params.opdId;
      const opd: WithId<Opd> | null = await DBCollections.opd.findOne({
        _id: new Object(opdId),
      });

      if (opd === null) {
        return next(
          new AppError(
            "opd_not_found",
            "Opd doesnot exists with the provided id",
            404
          )
        );
      }

      // If the opd found then we have to send the current appointment details

      const currentAppointmentId: ObjectId = opd.currentAppointment as ObjectId;
      const currentAppointment: WithId<Appointment> | null =
        await DBCollections.appointment.findOne({
          _id: new ObjectId(currentAppointmentId),
        });
    } catch (error) {
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

// Fetch all the appointments in the opd

export const fetchOpdPatients = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id))
      return next(new AppError("invalid_req_params", "Invalid opd id", 400));

    const appointments: WithId<Appointment>[] = await DBCollections.appointment
      .find({ opdId: new ObjectId(id) })
      .toArray();

    console.log(appointments);

    return res.status(200).json({ appointments: appointments });
  }
);

// Get Opd by Id

export const getOpdById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const opd: WithId<Opd> | null = await DBCollections.opd.findOne({
      _id: new ObjectId(id),
    });

    if (opd) {
      const response: ResponseObject = {
        code: "fetched",
        status: "success",
        message: "OPD record fetched",
        items: opd,
      };

      return res.status(200).json(response);
    } else {
      const response: ResponseObject = {
        code: "opd_not_found",
        status: "fail",
        message: "OPD record not found with the provided id",
        items: null,
      };

      return res.status(404).json(response);
    }
  }
);

// Assign doctor to opd

export const assignDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError)
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );

    const data: assignDoctorBody = req.joiValue;

    const doctorId = new ObjectId(data.assignedDoctor?.toString());
    const opdId = new ObjectId(data.opdId?.toString());
    // Now checking if the doctor exists

    const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne({
      _id: doctorId,
    });

    if (!doctor) {
      return next(
        new AppError(
          "doctor_not_found",
          "Doctor record not founded with the provided id",
          404
        )
      );
    }

    const result = await DBCollections.opd.updateOne(
      { _id: opdId },
      { $set: { doctorId: doctorId } }
    );

    const response: ResponseObject = {
      code: "updated",
      status: "success",
      message: "Doctor assigned successfully",
      items: doctor,
    };
    return res.status(203).json(response);
  }
);

// Utility functions

export const deleteAllOpds = catchAsync(
  (req: Request, res: Response, next: NextFunction) => {
    DBCollections.opd.deleteMany({});
  }
);
