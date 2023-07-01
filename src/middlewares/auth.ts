import jwt, { JwtPayload } from "jsonwebtoken";
import DBCollections from "../config/DBCollections";
import { catchAsync } from "../utils/catch.async";
import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { WithId } from "mongodb";
import { Admin } from "../models/admin";

import dotenv from "dotenv";
import path from "path";
import { Patient } from "../models/patient";
import { Doctor } from "../models/doctor";

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

export const isPatientLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get the headers and check whether there is jwt or not

    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "logged_out") {
      return next(
        new AppError("unauthenticated", "You are not logged in.", 404)
      );
    }

    // 2) verfication of token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      console.log("Error : ", err);
      return next(
        new AppError("unauthenticated", "Invalid Token provided", 401)
      );
    }

    // 3) check if user still exist
    const currentUser: WithId<Patient> | null =
      await DBCollections.patients.findOne({
        cnic: decoded.sub,
      });

    if (!currentUser) {
      return next(
        new AppError("unauthenticated", "You are not logged in", 400)
      );
    }

    // 5) Grant Accces To Protected Route
    req.currentUser = currentUser;
    return next();
  }
);
export const isDoctorLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get the headers and check whether there is jwt or not

    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "logged_out") {
      return next(
        new AppError("unauthenticated", "You are not logged in.", 404)
      );
    }

    // 2) verfication of token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      console.log("Error : ", err);
      return next(
        new AppError("unauthenticated", "Invalid Token provided", 401)
      );
    }

    // 3) check if doctor still exist
    const currentUser: WithId<Doctor> | null =
      await DBCollections.doctors.findOne({
        cnic: decoded.sub,
      });

    if (!currentUser) {
      return next(
        new AppError("unauthenticated", "You are not logged in", 400)
      );
    }

    // 5) Grant Accces To Protected Route
    req.currentUser = currentUser;
    return next();
  }
);

export const isAdminLoggedIn = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get the headers and check whether there is jwt or not

    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "logged_out") {
      return next(
        new AppError("unauthenticated", "You are not logged in.", 404)
      );
    }

    // 2) verfication of token
    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch (err) {
      console.log("Error : ", err);
      return next(
        new AppError("unauthenticated", "Invalid Token provided", 401)
      );
    }

    // 3) check if doctor still exist
    const currentUser: WithId<Admin> | null = await DBCollections.admin.findOne(
      {
        cnic: decoded.sub,
      }
    );

    if (!currentUser) {
      return next(
        new AppError("unauthenticated", "You are not logged in", 400)
      );
    }

    // 5) Grant Accces To Protected Route
    req.currentUser = currentUser;
    return next();
  }
);
