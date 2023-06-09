import { getDb } from "../db/conn";
import { Appointment } from "../models/appointment";
import { Department } from "../models/department";
import { Doctor } from "../models/doctor";
import { Opd } from "../models/opd";
import { Patient } from "../models/patient";
import {
  Medicine,
  PatientMedicine,
  Prescription,
} from "../models/prescription";

const db = getDb();

export const collections = {
  APPOINTMENT: "appointment",
  DOCTOR: "doctor",
  OPD: "opd",
  PATIENT: "patient",
  PRESCRIPTIONS: "prescription",
  DEPARTMENT: "department",
  PATIENTMEDICINES: "patientMedicines",
  MEDICINES: "medicines",
};

const appointment = db.collection<Appointment>(collections.APPOINTMENT);
const doctors = db.collection<Doctor>(collections.DOCTOR);
const opd = db.collection<Opd>(collections.OPD);
const patients = db.collection<Patient>(collections.PATIENT);
const prescriptions = db.collection<Prescription>(collections.PRESCRIPTIONS);
const departments = db.collection<Department>(collections.DEPARTMENT);
const patientMedicines = db.collection<PatientMedicine>(
  collections.PATIENTMEDICINES
);
const medicines = db.collection<Medicine>(collections.MEDICINES);

const DBCollections = {
  doctors,
  patients,
  departments,
  appointment,
  opd,
  prescriptions,
  patientMedicines,
  medicines,
};

export default DBCollections;
