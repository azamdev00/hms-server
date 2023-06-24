import { Router } from "express";
import {
  addAppointment,
  getAppoint,
  getAppointments,
  getPatientAppointmentByPatientId,
  getWaitingPatients,
} from "../../controllers/appointment";
import { addDeparment, getAllDepartments } from "../../controllers/department";
import { isPatientLoggedIn } from "../../middlewares/auth";
import { joiValidate } from "../../middlewares/joi.validate";
import { AddAppointmentSchema } from "../../validations/appointment";
import { DepartmentSchema } from "../../validations/department";

export const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  joiValidate(AddAppointmentSchema, "body"),
  isPatientLoggedIn,
  addAppointment
);

appointmentRouter.get("/", getAppointments);
appointmentRouter.get("/:id", getAppoint);
appointmentRouter.get("/patient/:id", getPatientAppointmentByPatientId);
appointmentRouter.get("/waiting", getWaitingPatients);

// departmentRouter.get("/", getAllDepartments);
// departmentRouter.post("/", joiValidate(DepartmentSchema, "body"), addDeparment);
