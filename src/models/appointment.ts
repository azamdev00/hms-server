import { ObjectId } from "mongodb";

export interface Appointment {
  _id: ObjectId;
  patientId: ObjectId;
  time: Date;
  status: "Active" | "Completed" | "Cancelled";
  department: string;
  tokenNumber: Number;
}

export interface AddAppointmentBody {
  fromTime: Date;
  toTime: Date;
  time: Date;
  status: "Active" | "Completed" | "Cancelled";
  department: string;
  tokenNumber: Number;
}
