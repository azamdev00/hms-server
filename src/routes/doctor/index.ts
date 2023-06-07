import { Router } from "express";
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
} from "../../controllers/doctor";

import { joiValidate } from "../../middlewares/joi.validate";
import { DoctorSchema } from "../../validations/doctor";

export const doctorRouter = Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", joiValidate(DoctorSchema, "body"), addDoctor);
