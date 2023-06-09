import { Router } from "express";
import * as patientMedicinesController from "../../controllers/patientMedicine";
import { joiValidate } from "../../middlewares/joi.validate";
import { addPatientMedicineSchema } from "../../validations/patientMedicine";

export const patientMedicinesRouter = Router();

patientMedicinesRouter.post(
  "/",
  joiValidate(addPatientMedicineSchema, "body"),
  patientMedicinesController.addPatientMedicine
);
patientMedicinesRouter.get("/", patientMedicinesController.getPatientMedicine);
