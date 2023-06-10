import { ObjectId } from "mongodb";

export interface Prescription {
  doctorId: ObjectId;
  opdId: ObjectId;
  patientId: ObjectId;
  appointmentId: ObjectId;
  createdAt: Date;
  medicines: PatientMedicine[];
  diagnosis: Diagnosis[];
}

export interface Medicine {
  name: string;
  amount: number;
  measures: string;
}

export interface PatientMedicine {
  medicineId: ObjectId;
  timeToTake: Number;
  daysToTake: number;
  afterMeal: boolean;
}

export interface Diagnosis {
  testId: ObjectId;
  report?: string;
}

export interface Test {
  name: string;
  description: string;
}
