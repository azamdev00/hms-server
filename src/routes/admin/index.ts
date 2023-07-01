import { Router } from "express";
import { addAdmin } from "../../controllers/admin";
import { joiValidate } from "../../middlewares/joi.validate";
import { addAdminSchema } from "../../validations/admin";

export const adminRouter = Router();

adminRouter.post("/", joiValidate(addAdminSchema, "body"), addAdmin);
