import Joi from "joi";

export const addAdminSchema = Joi.object({
  firstName: Joi.string().required().empty().messages({
    "any.required": "Admin first name is required",
    "string.base": "Admin  first name must be a string",
    "string.empty": "Admin first name must not be empty",
  }),
  lastName: Joi.string().required().empty().messages({
    "any.required": "Admin last name is required",
    "string.base": "Admin  last name must be a string",
    "string.empty": "Admin last name must not be empty",
  }),
  cnic: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
    .required()
    .messages({
      "any.required": "CNIC is required.",
      "string.empty": "CNIC cannot be empty.",
      "string.pattern.base": "CNIC must be in the format XXXXX-XXXXXXX-X.",
    }),

  role: Joi.string().required().empty().messages({
    "any.required": "Admin role is required",
    "string.base": "Admin  role must be a string",
    "string.empty": "Admin role must not be empty",
  }),
  password: Joi.string().required().min(8).max(16).messages({
    "any.required": "Password is required",
    "string.base": "Password must be a string",
    "string.min": "Password length must  be grater or equal to 8",
    "string.max": "Password length must  be less then 16",
  }),
});
