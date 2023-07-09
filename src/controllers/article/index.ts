import { NextFunction, Request, Response } from "express";
import { ValidationError } from "joi";
import { InsertOneResult, ObjectId, WithId } from "mongodb";
import DBCollections from "../../config/DBCollections";
import { Article } from "../../models/article";
import { Doctor } from "../../models/doctor";
import { ResponseObject } from "../../models/response.model";
import AppError from "../../utils/AppError";
import { catchAsync } from "../../utils/catch.async";

export const addArticle = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const joiError: ValidationError = req.joiError;

    if (joiError) {
      return next(
        new AppError("invalid_req_body", joiError.details[0].message, 400)
      );
    }

    const body: Article = req.joiValue;
    const currentUser = req.currentUser;

    // Fetching doctor id
    const doctor: WithId<Doctor> | null = await DBCollections.doctors.findOne({
      cnic: currentUser.cnic,
    });

    body.doctorId = doctor?._id;

    const insertedData: WithId<Article> = {
      _id: new ObjectId(),
      ...body,
    };

    const result: InsertOneResult<WithId<Article>> =
      await DBCollections.article.insertOne(insertedData);

    if (!result.acknowledged)
      return next(new AppError("server_error", "Please try again later", 502));

    const response: ResponseObject = {
      code: "record_created",
      message: "Article created",
      status: "success",
      items: insertedData,
    };

    return res.status(200).json(response);
  }
);

// Get articles function

export const getArticles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const articles: WithId<Article>[] = await DBCollections.article
      .find()
      .toArray();

    const response: ResponseObject = {
      code: "fetched",
      status: "success",
      message: "All articles fetched",
      items: articles,
    };

    return res.status(200).json(response);
  }
);

// Get article by id
export const getArticleById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!ObjectId.isValid(id))
      return next(
        new AppError("invalid_req_params", "Invalid article id", 401)
      );

    const article: WithId<Article> | null = await DBCollections.article.findOne(
      { _id: new ObjectId(id) }
    );

    if (!article)
      return next(
        new AppError("not_founded", "Article not fond with this id", 404)
      );

    const response: ResponseObject = {
      code: "fetched",
      status: "success",
      message: "All articles fetched",
      items: article,
    };

    return res.status(200).json(response);
  }
);
// Get article by doctor id
export const getDoctorArticles = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doctorId = req.params.id;

    if (!ObjectId.isValid(doctorId))
      return next(
        new AppError("invalid_req_params", "Invalid article id", 401)
      );

    const articles: WithId<Article>[] = await DBCollections.article
      .find({ doctorId: new ObjectId(doctorId) })
      .toArray();

    if (!articles)
      return next(
        new AppError("not_founded", "Article not fond with this id", 404)
      );

    const response: ResponseObject = {
      code: "fetched",
      status: "success",
      message: "All articles fetched",
      items: articles,
    };

    return res.status(200).json(response);
  }
);
