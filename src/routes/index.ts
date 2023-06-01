import { Router } from "express";
import { patientRouter } from "./patient";
import { authRouter } from "./auth";
import { doctorRouter } from "./doctor";
import { departmentRouter } from "./department";
import { appointmentRouter } from "./appointment";
import { opdRouter } from "./opd";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/doctor", doctorRouter);
mainRouter.use("/department", departmentRouter);
mainRouter.use("/appointment", appointmentRouter);
mainRouter.use("/opd", opdRouter);

mainRouter.use("/patient", patientRouter);
