import { getDb } from "../db/conn";
import { Country } from "../models/country.model";

const db = getDb();

export const collections = {
  COUNTRY: "country",
};

const countries = db.collection<Country>(collections.COUNTRY);

const DBCollections = { countries };

export default DBCollections;
