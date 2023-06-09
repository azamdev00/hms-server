import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catch.async";
import AppError from "../../utils/AppError";
import {
  Diagnosis,
  PatientMedicine,
  Prescription,
} from "../../models/prescription";
import { ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { ResponseObject } from "../../models/response.model";

export const addPrescription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { patientId, opdId, medicines, diagnosis, appointmentId } =
        req.body;

      const setMedicines = medicines.map((medicine: PatientMedicine) => {
        return { ...medicine, medicineId: new ObjectId(medicine.medicineId) };
      });

      const setDiagnosis = diagnosis.map((diagnose: Diagnosis) => {
        return { diagnose, testId: new ObjectId(diagnose.testId) };
      });

      const data: WithId<Prescription> = {
        _id: new ObjectId(),
        doctorId: new ObjectId(req.currentUser._id),
        patientId: new ObjectId(patientId),
        opdId: new ObjectId(opdId),
        appointmentId: new ObjectId(appointmentId),
        medicines: setMedicines,
        diagnosis: setDiagnosis,
        createdAt: new Date(),
      };

      const result = await DBCollections.prescriptions.insertOne(data);
      await DBCollections.appointment.updateOne(
        { _id: new ObjectId(appointmentId) },
        { $set: { status: "Completed" } }
      );

      if (!result)
        return next(
          new AppError("server_error", "Please try again later", 500)
        );

      const response: ResponseObject = {
        code: "created",
        status: "success",
        message: "Patient Prescription added successfully",
        items: data,
      };

      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

export const getPrescription = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params["id"];

      const prescription: WithId<Prescription> | null =
        await DBCollections.prescriptions.findOne({ _id: new ObjectId(id) });

      if (!prescription)
        return next(
          new AppError("record_not_found", "Prescription not found", 404)
        );

      const response: ResponseObject = {
        code: "created",
        status: "success",
        message: "Prescription fetch successfully",
        items: prescription,
      };

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);

export const getPrescriptionsByPateintId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id: string = req.params["id"];

      const prescriptions: WithId<Prescription>[] =
        await DBCollections.prescriptions
          .find({ patientId: new ObjectId(id) })
          .toArray();

      if (!prescriptions)
        return next(
          new AppError("record_not_found", "Prescription not found", 404)
        );

      const response: ResponseObject = {
        code: "created",
        status: "success",
        message: "Patient Prescriptions fetch successfully",
        items: prescriptions,
      };

      res.status(200).json(response);
    } catch (error) {
      console.log(error);
      return next(new AppError("server_error", "Please try again later", 500));
    }
  }
);
