import { ObjectId } from "mongodb";

export interface Appointment {
  _id: ObjectId;
  patientId: ObjectId;
  opdId: ObjectId;
  time: Date;
  status: "Waiting" | "Completed" | "Pending_Test" | "Cancelled";
  tokenNumber: Number;
}

export interface AddAppointmentBody {
  opdId: string;
  fromTime: Date;
  toTime: Date;
  time: Date;
  status: "Waiting" | "Completed" | "Cancelled" | "Pending_Test";
  tokenNumber: Number;
}
