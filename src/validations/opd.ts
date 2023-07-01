import Joi from "joi";

export const OpdSchema = Joi.object({
  departmentId: Joi.string().required().messages({
    "string.empty": "Department id should not be empty",
    "any.required": "Department id is required",
    "string.base": "Department id should be a string",
  }),

  assignedDoctor: Joi.string().default(null),
});

export const assignDoctorSchema = Joi.object({
  assignedDoctor: Joi.string().required().messages({
    "any.required": "Assign doctor must be a valid doctor id in string format",
    "string.base": "Assign doctor must be a valid doctor id in string format",
  }),

  opdId: Joi.string().required().messages({
    "any.required": "opdId is required",
    "string.base": "opdId must be a valid opdId in string format",
  }),
});
