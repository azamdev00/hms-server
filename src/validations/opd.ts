import Joi from "joi";

export const addOpdSchema = Joi.object({
  departmentId: Joi.string().required().messages({
    "string.empty": "Department id should not be empty",
    "any.required": "Department id is required",
    "string.base": "Department id should be a string",
  }),
});
