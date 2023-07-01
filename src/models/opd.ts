import { ObjectId } from "mongodb";

export interface Opd {
  departmentId: ObjectId;
  assignedDoctor?: string | ObjectId | null;
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
  assignedDoctor: string | ObjectId | null;
}

export interface assignDoctorBody {
  assignedDoctor: string | ObjectId | null;
  opdId: string;
}
