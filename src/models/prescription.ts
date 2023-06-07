import { ObjectId } from "mongodb";

export interface Prescription {
  doctorId: ObjectId;
  opdId: ObjectId;
  patientId: ObjectId;
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
  timeToTake: string;
  daysToTake: number;
  afterMeal: boolean;
}

export interface Diagnosis {
  testId: ObjectId;
}

export interface Test {
  name: string;
}

// export interface LabReport {

// }
