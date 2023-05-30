import Joi from "joi";

export const PatientLoginSchema = Joi.object({
  cnic: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
    .required()
    .messages({
      "any.required": "CNIC is required.",
      "string.empty": "CNIC cannot be empty.",
      "string.pattern.base": "CNIC must be in the format XXXXX-XXXXXXX-X.",
    }),
  password: Joi.string().min(8).max(32).required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password cannot be empty.",
    "string.min": "Password must be at least 8 characters long.",
    "string.max": "Password cannot exceed 32 characters.",
  }),
});
