import Joi from "joi";

export const addDiagnosisSchema = Joi.object({
  testId: Joi.string().empty().required().messages({
    "string.base": "Test Id must be a string",
    "string.empty": "Test Id not be emtpy",
    "any.required": "Test Id is required",
  }),

  report: Joi.string().allow("").optional().messages({
    "string.base": "Report must be a string",
  }),
});
