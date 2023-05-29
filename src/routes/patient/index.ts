import { Router } from "express";
import { getAllPatients } from "../../controllers/patient";

export const patientRouter = Router();

patientRouter.get("/", getAllPatients);
