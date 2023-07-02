import { Router } from "express";
import {
  addDoctor,
  getAllDoctors,
  getDoctorById,
  getDoctorOpd,
} from "../../controllers/doctor";

import { joiValidate } from "../../middlewares/joi.validate";
import { DoctorSchema } from "../../validations/doctor";
import { isDoctorLoggedIn } from "../../middlewares/auth";

export const doctorRouter = Router();

doctorRouter.get("/", getAllDoctors);
doctorRouter.get("/opd", isDoctorLoggedIn, getDoctorOpd);
doctorRouter.get("/:id", getDoctorById);
doctorRouter.post("/", joiValidate(DoctorSchema, "body"), addDoctor);
