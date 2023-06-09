import { Router } from "express";
import * as medicineController from "../../controllers/medicine";
import { joiValidate } from "../../middlewares/joi.validate";
import { addMedicineSchema } from "../../validations/medicine";

export const medicineRouter = Router();

medicineRouter.post(
  "/",
  joiValidate(addMedicineSchema, "body"),
  medicineController.addMedicine
);

medicineRouter.get("/", medicineController.getMedicins);
