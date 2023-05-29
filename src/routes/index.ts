import { Router } from "express";
import { patientRouter } from "./patient";

export const mainRouter = Router();

mainRouter.use("/patient", patientRouter);
