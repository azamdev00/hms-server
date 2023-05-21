import { NextFunction, Request, Response } from "express";
import Joi, { Schema } from "joi";

export const joiValidate = (
  _schema: Schema | string,
  property: keyof Request,
  options: Joi.ValidationOptions = {}
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const schema =
      typeof _schema === "string" ? req[_schema as keyof Request] : _schema;

    const { error, value } = schema.validate(req[property], {
      errors: { wrap: { label: "", array: "" } },
      ...options,
    });

    const valid = error == null;
    if (valid) {
      req.joiValue = value;
      next();
    } else {
      req.joiError = error;
      next();
    }
  };
};
