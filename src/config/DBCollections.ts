import { getDb } from "../db/conn";
import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";

const db = getDb();

export const collections = {
  PATIENT: "patient",
  DOCTOR: "doctor",
};

const doctors = db.collection<Doctor>(collections.DOCTOR);

const patients = db.collection<Patient>(collections.PATIENT);

const DBCollections = { doctors, patients };

export default DBCollections;
