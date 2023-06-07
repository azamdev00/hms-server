import { Router } from "express";
import {
  addOpd,
  deleteAllOpds,
  getOpds,
  joinOpd,
  leaveOpd,
} from "../../controllers/opd";
import { isDoctorLoggedIn } from "../../middlewares/auth";

import { joiValidate } from "../../middlewares/joi.validate";
import { DoctorSchema } from "../../validations/doctor";
import { OpdSchema } from "../../validations/opd";

export const opdRouter = Router();

opdRouter.get("/", getOpds);
opdRouter.post("/", joiValidate(OpdSchema, "body"), addOpd);
opdRouter.post("/join/:id", isDoctorLoggedIn, joinOpd);
opdRouter.post("/leave/:id", isDoctorLoggedIn, leaveOpd);

// Deleting all opds Utitliy funciton
opdRouter.delete("/", deleteAllOpds);