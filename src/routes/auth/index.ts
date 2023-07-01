import { Router } from "express";
import { joiValidate } from "../../middlewares/joi.validate";
import {
  DoctorLoginSchema,
  LoginSchema,
  PatientLoginSchema,
} from "../../validations/auth";
import {
  doctorLogin,
  getCurrentDoctor,
  getCurrentPatient,
  login,
  patientLogin,
} from "../../controllers/auth";
import { isDoctorLoggedIn, isPatientLoggedIn } from "../../middlewares/auth";

export const authRouter = Router();

authRouter.post(
  "/patientlogin",
  joiValidate(PatientLoginSchema, "body"),
  patientLogin
);
authRouter.post(
  "/doctorlogin",
  joiValidate(DoctorLoginSchema, "body"),
  doctorLogin
);

authRouter.post("/login", joiValidate(LoginSchema, "body"), login);

authRouter.get("/patient", isPatientLoggedIn, getCurrentPatient);
authRouter.get("/doctor", isDoctorLoggedIn, getCurrentDoctor);
