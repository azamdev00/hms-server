import { ObjectId } from "mongodb";

export interface Article {
  doctorId?: ObjectId;
  heading: string;
  title: string;
  description: string;
  image: string;
  html?: string;
}
