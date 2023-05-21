import { Router } from "express";
import { countryRouter } from "./country.routes";

export const mainRouter = Router();

mainRouter.use("/country", countryRouter);
