import { Router } from "express";
import { joiValidate } from "../../middlewares/joi.validate";
import { PatientLoginSchema } from "../../validations/auth";
import { patientLogin } from "../../controllers/auth";

export const authRouter = Router();

authRouter.post(
  "/patientlogin",
  joiValidate(PatientLoginSchema, "body"),
  patientLogin
);
