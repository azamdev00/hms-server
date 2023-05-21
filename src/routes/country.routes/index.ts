import { Router } from "express";
import { getAllCountries } from "../../controllers/country.controller";

export const countryRouter = Router();

countryRouter.get("/", getAllCountries);
