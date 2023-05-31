import { Router } from "express";
import { patientRouter } from "./patient";
import { authRouter } from "./auth";
import { doctorRouter } from "./doctor";
import { departmentRouter } from "./department";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/doctor", doctorRouter);
mainRouter.use("/department", departmentRouter);

mainRouter.use("/patient", patientRouter);
