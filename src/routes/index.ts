import { Router } from "express";
import { patientRouter } from "./patient";
import { authRouter } from "./auth";
import { doctorRouter } from "./doctor";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/doctor", doctorRouter);

mainRouter.use("/patient", patientRouter);
