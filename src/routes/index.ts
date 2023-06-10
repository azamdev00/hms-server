import { Router } from "express";
import { patientRouter } from "./patient";
import { authRouter } from "./auth";
import { doctorRouter } from "./doctor";
import { departmentRouter } from "./department";
import { appointmentRouter } from "./appointment";
import { opdRouter } from "./opd";
import { prescriptionRouter } from "./prescription";
import { patientMedicinesRouter } from "./patientMedicine";
import { medicineRouter } from "./medicine";
import { testRotuer } from "./test";
import { diagnosisRouter } from "./diagnosis";

export const mainRouter = Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/appointment", appointmentRouter);
mainRouter.use("/doctor", doctorRouter);
mainRouter.use("/department", departmentRouter);
mainRouter.use("/opd", opdRouter);
mainRouter.use("/prescription", prescriptionRouter);
mainRouter.use("/patientmedicine", patientMedicinesRouter);
mainRouter.use("/patient", patientRouter);
mainRouter.use("/medicine", medicineRouter);
mainRouter.use("/test", testRotuer);
mainRouter.use("/diagnosis", diagnosisRouter);
