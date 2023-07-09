import Joi from "joi";
import { addArticle } from "../controllers/article";

export const addArticleSchema = Joi.object({
  heading: Joi.string().required().messages({
    "string.base": "Heading must be a string",
    "string.empty": "Heading cannot be empty",
    "any.required": "Heading is required",
  }),
  title: Joi.string().trim().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),
  description: Joi.string().trim().required().messages({
    "string.base": "Description must be a string",
    "string.empty": "Description cannot be empty",
    "any.required": "Description is required",
  }),
  image: Joi.string().trim().required().messages({
    "string.base": "Image must be a string",
    "string.empty": "Image cannot be empty",
    "any.required": "Image is required",
  }),
  html: Joi.string().trim().allow("").optional().messages({
    "string.base": "HTML must be a string",
    "string.empty": "HTML cannot be empty",
  }),
});
