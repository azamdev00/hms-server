import { Router } from "express";
import { addDeparment, getAllDepartments } from "../../controllers/department";
import { joiValidate } from "../../middlewares/joi.validate";
import { DepartmentSchema } from "../../validations/department";

export const departmentRouter = Router();

departmentRouter.get("/", getAllDepartments);
departmentRouter.post("/", joiValidate(DepartmentSchema, "body"), addDeparment);
