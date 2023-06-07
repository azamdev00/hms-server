import { ObjectId } from "mongodb";

export interface Opd {
  departmentId: ObjectId;
  doctorId: ObjectId | null;
  nextAppointment: ObjectId | null;
  currentAppointment: ObjectId | null;
  date: Date;
  status: "Start" | "Idle" | "Closed" | "Stopped";
  currentToken: Number;
  lastToken: Number;
  inQueue: Number;
  expectedTimeToNext: Date;
}

export interface AddOpdBody {
  departmentId: ObjectId;
}
