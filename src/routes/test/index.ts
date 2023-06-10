import { Router } from "express";
import * as testController from "../../controllers/test";
import { joiValidate } from "../../middlewares/joi.validate";
import { addTestSchema } from "../../validations/test";

export const testRotuer = Router();

testRotuer.post(
  "/",
  joiValidate(addTestSchema, "body"),
  testController.AddTest
);

testRotuer.get("/", testController.getTest);
