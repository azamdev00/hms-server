import { ObjectId } from "mongodb";

export interface Country {
  _id: ObjectId;
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencyName: string;
  currencySymbol: string;
}
