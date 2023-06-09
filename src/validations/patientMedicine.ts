import Joi from "joi";

export const addPatientMedicineSchema = Joi.object({
  medicineId: Joi.string().empty().required().messages({
    "string.base": "Medicine id must be a string",
    "any.required": "Medicine id is required",
    "string.empty": "Medicine id not be empty",
  }),

  timeToTake: Joi.number()
    .required()
    .messages({
      "any.required": "timeToTake is required",
      "number.base": "Time to take must be a number",
    }),
  daysToTake: Joi.number()
    .required()
    .messages({
      "any.required": "Days to take is required",
      "number.base": "Days to take must be a number",
    }),
  afterMeal: Joi.boolean().default(true),
});
