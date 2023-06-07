import Joi from "joi";

export const AddAppointmentSchema = Joi.object({
  time: Joi.date().default(Date.now),
  status: Joi.string().default("Waiting"),
  opdId: Joi.string().empty().required().messages({
    "any.required": "Opd id is required",
    "string.empty": "Opd id cannot be empty",
    "string.base": "Opd id is a string",
  }),
});
