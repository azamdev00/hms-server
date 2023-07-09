import { Router } from "express";
import {
  addArticle,
  getArticleById,
  getArticles,
  getDoctorArticles,
} from "../../controllers/article";
import { isDoctorLoggedIn } from "../../middlewares/auth";
import { joiValidate } from "../../middlewares/joi.validate";
import { addArticleSchema } from "../../validations/article";

export const articleRouter = Router();

articleRouter.post(
  "/",
  isDoctorLoggedIn,
  joiValidate(addArticleSchema, "body"),
  addArticle
);

articleRouter.get("/", getArticles);
articleRouter.get("/:id", getArticleById);
articleRouter.get("/doctor/:id", getDoctorArticles);
