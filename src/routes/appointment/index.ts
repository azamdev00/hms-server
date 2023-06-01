import { Router } from "express";
import { addAppointment, getAppointments } from "../../controllers/appointment";
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

// departmentRouter.get("/", getAllDepartments);
// departmentRouter.post("/", joiValidate(DepartmentSchema, "body"), addDeparment);
