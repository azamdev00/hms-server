import { Router } from "express";
import { joiValidate } from "../../middlewares/joi.validate";
import { PatientLoginSchema } from "../../validations/auth";
import { getCurrentPatient, patientLogin } from "../../controllers/auth";
import { isPatientLoggedIn } from "../../middlewares/auth";

export const authRouter = Router();

authRouter.post(
  "/patientlogin",
  joiValidate(PatientLoginSchema, "body"),
  patientLogin
);

authRouter.get("/patient", isPatientLoggedIn, getCurrentPatient);
