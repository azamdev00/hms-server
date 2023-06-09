import Joi from "joi";

export const addMedicineSchema = Joi.object({
  name: Joi.string().empty().required().messages({
    "string.base": "Name must be a string",
    "any.required": "Name is required",
    "string.empty": "Name must not be empty",
  }),
  amount: Joi.number().required().messages({
    "number.base": "Amount must be a number",
    "any.rquired": "Amount is required",
  }),

  measures: Joi.string()
    .required()
    .messages({
      "string.base": "Measures must be a string",
      "string.empty": "Measures not be empty",
      "any.required": "Measures is required",
    }),
});
