import Joi from "joi";

export const AddAppointmentSchema = Joi.object({
  // fromTime: Joi.string()
  //   .isoDate()
  //   .custom((value, helpers) => {
  //     if (!value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
  //       return helpers.error("any.invalid");
  //     }
  //     return value;
  //   }, "From time validation")
  //   .required()
  //   .messages({
  //     "any.required": "From time is required",
  //     "any.invalid":
  //       "Invalid date format. Please provide a valid date with time (YYYY-MM-DD HH:mm:ss)",
  //   }),
  // toTime: Joi.string()
  //   .isoDate()
  //   .custom((value, helpers) => {
  //     if (!value.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
  //       return helpers.error("any.invalid");
  //     }
  //     return value;
  //   }, "To time validation")
  //   .required()
  //   .messages({
  //     "any.required": "To time is required",
  //     "any.invalid":
  //       "Invalid date format. Please provide a valid date with time (YYYY-MM-DD HH:mm:ss)",
  //   }),

  time: Joi.date().default(Date.now),
  status: Joi.string().default("Active"),
  department: Joi.string().required().empty().messages({
    "string.empty": "Department cannot not be empty",
    "any.required": "Department is required",
  }),
});
