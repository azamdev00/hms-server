import Joi, { CustomHelpers } from "joi";

export const AddAppointmentSchema = Joi.object({
  time: Joi.date().default(Date.now),
  status: Joi.string().default("Waiting"),
  fromTime: Joi.date().required().messages({
    "date.base": "The from time field must be a valid date.",
    "date.required": "The from time field is required.",
  }),
  toTime: Joi.date().required().messages({
    "date.base": "The To time field must be a valid date.",
    "date.required": "The To time field is required.",
  }),
  opdId: Joi.string().empty().required().messages({
    "any.required": "Opd id is required",
    "string.empty": "Opd id cannot be empty",
    "string.base": "Opd id is a string",
  }),
});
