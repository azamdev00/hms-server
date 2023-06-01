import { Router } from "express";
import { addOpd, getOpds } from "../../controllers/opd";
import { isDoctorLoggedIn } from "../../middlewares/auth";

import { joiValidate } from "../../middlewares/joi.validate";
import { DoctorSchema } from "../../validations/doctor";
import { addOpdSchema } from "../../validations/opd";

export const opdRouter = Router();

opdRouter.get("/", getOpds);
opdRouter.post(
  "/",
  joiValidate(addOpdSchema, "body"),
  isDoctorLoggedIn,
  addOpd
);
