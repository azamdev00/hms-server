import { ObjectId } from "mongodb";

export interface Opd {
  departmentId: ObjectId;
  doctorId: ObjectId;
  date: Date;
  status: "Start" | "Closed" | "Stopped";
  treated: Number;
  canceled: Array<Number>;
  totalCanceled: Number;
  currentToken: Number;
  lastToken: Number;
  inQueue: Number;
  expectedTimeToNext: Date;
}

export interface AddOpdBody {
  departmentId: ObjectId;
}
