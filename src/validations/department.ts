import Joi from "joi";

export const DepartmentSchema = Joi.object({
  name: Joi.string().empty().required().messages({
    "staring.base": "Department name must be string",
    "any.required": "Department name is required",
    "string.empty": "Department name cannot be empty",
  }),

  onDays: Joi.array().items(Joi.string().required().empty()).messages({
    "array.base": "The onDays field must be an array",
    "any.required": "The onDays field is required",
    "string.empty": "The onDays field cannot contain empty strings",
  }),
});
