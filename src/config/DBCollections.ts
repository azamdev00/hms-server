import { getDb } from "../db/conn";
import { Department } from "../models/department";
import { Doctor } from "../models/doctor";
import { Patient } from "../models/patient";

const db = getDb();

export const collections = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  DEPARTMENT: "department",
};

const doctors = db.collection<Doctor>(collections.DOCTOR);

const patients = db.collection<Patient>(collections.PATIENT);
const departments = db.collection<Department>(collections.DEPARTMENT);

const DBCollections = { doctors, patients, departments };

export default DBCollections;
