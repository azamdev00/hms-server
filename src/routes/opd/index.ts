import { Router } from "express";
import {
  addOpd,
  assignDoctor,
  changeOpdStatus,
  deleteAllOpds,
  fetchOpdPatients,
  getActiveOpds,
  getCurrentAppointmentDetails,
  getOpdById,
  getOpds,
  joinOpd,
  leaveOpd,
  nextPateient,
  stopOpd,
} from "../../controllers/opd";
import { isAdminLoggedIn, isDoctorLoggedIn } from "../../middlewares/auth";

import { joiValidate } from "../../middlewares/joi.validate";
import { assignDoctorSchema, OpdSchema } from "../../validations/opd";

export const opdRouter = Router();

opdRouter.get("/", getOpds);
opdRouter.post("/", joiValidate(OpdSchema, "body"), addOpd);
opdRouter.post("/join/:id", isDoctorLoggedIn, joinOpd);
opdRouter.post("/leave/:id", isDoctorLoggedIn, leaveOpd);
opdRouter.post("/stop/:id", isDoctorLoggedIn, stopOpd);
opdRouter.post("/next/:id", isDoctorLoggedIn, nextPateient);
opdRouter.post("/changestatus", isAdminLoggedIn, changeOpdStatus);
opdRouter.get("/current/:id", isDoctorLoggedIn, getCurrentAppointmentDetails);
opdRouter.get("/appointment/:id", isDoctorLoggedIn, fetchOpdPatients);
opdRouter.get("/active", getActiveOpds);
opdRouter.get("/:id", getOpdById);
opdRouter.post(
  "/doctor/assign",
  joiValidate(assignDoctorSchema, "body"),
  assignDoctor
);

// Deleting all opds Utitliy funciton
opdRouter.delete("/", deleteAllOpds);
