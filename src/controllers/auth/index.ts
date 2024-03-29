import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { catchAsync } from "../../utils/catch.async";
import { ValidationError } from "joi";
import AppError from "../../utils/AppError";
import { DoctorLogin, Login, PatientLogin } from "../../models/auth";
import { Patient } from "../../models/patient";
import { WithId } from "mongodb";
import { Admin } from "../../models/admin";
import DBCollections from "../../config/DBCollections";
import { getSafeObject } from "../../utils/get.safe.object";
import { ResponseObject } from "../../models/response.model";
import { Doctor } from "../../models/doctor";

export function signJWT(cnic: string) {
  return jwt.sign({ sub: cnic }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN + "d",
  });
}

export const patientLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;
    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );
    }
    const data: PatientLogin = req.joiValue;

    try {
      const patient: WithId<Patient> | null =
        await DBCollections.patients.findOne({ cnic: data.cnic });

      if (!patient)
        return new AppError(
          "patient_not_found",
          "Patient not Found, Please check your CNIC",
          404
        );

      if (!(await bcrypt.compare(data.password, patient.password))) {
        return next(
          new AppError("invalid_credentials", "Password is incorrect", 401)
        );
      }

      const safeUser = getSafeObject(patient, ["password"]);

      const jwt = signJWT(patient.cnic);

      const response: ResponseObject = {
        code: "authenticated",
        status: "success",
        message: "Patient is Login Successfully",
        items: safeUser,
        jwt,
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

export const getCurrentPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const safeUser = getSafeObject(req.currentUser, ["password"]);

    const response: ResponseObject = {
      code: "authenticated",
      status: "success",
      message: "Patient is fetch Successfully",
      items: safeUser,
    };

    res.status(200).json(response);
  }
);

// Doctor login controller  function
export const doctorLogin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;
    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );
    }
    const data: DoctorLogin = req.joiValue;

    try {
      const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne(
        { cnic: data.cnic }
      );

      if (!doctor)
        return new AppError(
          "doctor_not_found",
          "Doctor not Found, Please check your CNIC",
          404
        );

      if (!(await bcrypt.compare(data.password, doctor.password))) {
        return next(
          new AppError("invalid_credentials", "Password is incorrect", 401)
        );
      }

      const safeUser = getSafeObject(doctor, ["password"]);

      const jwt = signJWT(doctor.cnic);

      const response: ResponseObject = {
        code: "authenticated",
        status: "success",
        message: "Patient is Login Successfully",
        items: safeUser,
        jwt,
      };

      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Get current doctor
export const getCurrentDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const safeUser = getSafeObject(req.currentUser, ["password"]);

    const response: ResponseObject = {
      code: "authenticated",
      status: "success",
      message: "Patient is fetch Successfully",
      items: safeUser,
    };

    res.status(200).json(response);
  }
);

// This function is responsible for login of (Doctor, and Admins)
export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const error: ValidationError = req.joiError;

    if (error) {
      return next(
        new AppError("invalid_req_body", error.details[0].message, 400)
      );
    }

    const data: Login = req.joiValue;

    // Checking role if role === doctor then logging in doctor
    if (data.role === "doctor") {
      const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne(
        { cnic: data.cnic }
      );

      // Checking if doctor not founded
      if (!doctor)
        return next(
          new AppError(
            "doctor_not_found",
            "Doctor record does not exists with the provided cnic",
            404
          )
        );

      // Checking for password comparision
      if (!(await bcrypt.compare(data.password, doctor.password))) {
        return next(
          new AppError("invalid_credentials", "Password is incorrect", 401)
        );
      }

      const safeUser = getSafeObject(doctor, ["password"]);

      const jwt = signJWT(doctor.cnic);

      const response: ResponseObject = {
        code: "authenticated",
        status: "success",
        message: "Doctor is Login Successfully",
        items: safeUser,
        jwt,
      };

      return res.status(200).json(response);
    } else {
      const admin: WithId<Admin> | null = await DBCollections.admin.findOne({
        cnic: data.cnic,
      });

      // Checking if doctor not founded
      if (!admin)
        return next(
          new AppError(
            "user_not_found",
            "Admin record does not exists with the provided cnic",
            404
          )
        );

      // Checking for password comparision
      if (!(await bcrypt.compare(data.password, admin.password))) {
        return next(
          new AppError("invalid_credentials", "Password is incorrect", 401)
        );
      }

      const safeUser = getSafeObject(admin, ["password"]);

      const jwt = signJWT(admin.cnic);

      const response: ResponseObject = {
        code: "authenticated",
        status: "success",
        message: "Admin is Login Successfully",
        items: safeUser,
        jwt,
      };

      return res.status(200).json(response);
    }
  }
);
