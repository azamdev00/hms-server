import { Router } from "express";
import {
  addPrescription,
  getPrescription,
  getPrescriptionsByPateintId,
} from "../../controllers/prescription";

export const prescriptionRouter = Router();

prescriptionRouter.get("/bypatientid/:id", getPrescriptionsByPateintId);
prescriptionRouter.get("/:id", getPrescription);

prescriptionRouter.post("/", addPrescription);
