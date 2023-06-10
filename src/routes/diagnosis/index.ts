import { Router } from "express";
import * as diagnosisController from "../../controllers/diagnosis";

import { joiValidate } from "../../middlewares/joi.validate";
import { addDiagnosisSchema } from "../../models/diagnosis";

export const diagnosisRouter = Router();

diagnosisRouter.get("/", diagnosisController.getDiagnosis);
diagnosisRouter.post(
  "/",
  joiValidate(addDiagnosisSchema, "body"),
  diagnosisController.addDiagnosis
);
