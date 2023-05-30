import Joi from "joi";

export const PatientSchema = Joi.object({
  firstName: Joi.string().required().messages({
    "any.required": "First name is required.",
    "string.empty": "First name cannot be empty.",
  }),
  lastName: Joi.string().required().messages({
    "any.required": "Last name is required.",
    "string.empty": "Last name cannot be empty.",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .allow("")
    .messages({
      "string.email": "Email must be a valid email address.",
    }),
  cnic: Joi.string()
    .pattern(/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/)
    .required()
    .messages({
      "any.required": "CNIC is required.",
      "string.empty": "CNIC cannot be empty.",
      "string.pattern.base": "CNIC must be in the format XXXXX-XXXXXXX-X.",
    }),
  password: Joi.string()
    .min(8)
    .max(32)
    // .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/)
    .required()
    .messages({
      "any.required": "Password is required.",
      "string.empty": "Password cannot be empty.",
      "string.min": "Password must be at least 8 characters long.",
      "string.max": "Password cannot exceed 20 characters.",
    }),
  address: Joi.string().required().messages({
    "any.required": "Address is required.",
    "string.empty": "Address cannot be empty.",
  }),
  city: Joi.string().required().messages({
    "any.required": "City is required.",
    "string.empty": "City cannot be empty.",
  }),
  mobile: Joi.string()
    .pattern(/^(?:\+?92|0)[3456789]\d{9}$/)
    .required()
    .messages({
      "any.required": "Mobile number is required.",
      "string.empty": "Mobile number cannot be empty.",
      "string.pattern.base":
        "Mobile number must be a valid Pakistani phone number.",
    }),
});
