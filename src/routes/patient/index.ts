import { Router } from "express";
import { addPatient, getAllPatients } from "../../controllers/patient";
import { joiValidate } from "../../middlewares/joi.validate";
import { PatientSchema } from "../../validations/pateint";

export const patientRouter = Router();

patientRouter.get("/", getAllPatients);
patientRouter.post("/", joiValidate(PatientSchema, "body"), addPatient);
