import Joi from "joi";

export const addTestSchema = Joi.object({
  name: Joi.string().required().empty().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name not be empty",
    "any.required": "Name is required",
  }),

  description: Joi.string().required().empty().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description not be empty",
    "any.required": "Description is required",
  }),
});
