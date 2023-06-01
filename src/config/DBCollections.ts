import { getDb } from "../db/conn";
import { Appointment } from "../models/appointment";
import { Department } from "../models/department";
import { Doctor } from "../models/doctor";
import { Opd } from "../models/opd";
import { Patient } from "../models/patient";

const db = getDb();

export const collections = {
  PATIENT: "patient",
  DOCTOR: "doctor",
  DEPARTMENT: "department",
  APPOINTMENT: "appointment",
  OPD: "opd",
};

const doctors = db.collection<Doctor>(collections.DOCTOR);
const patients = db.collection<Patient>(collections.PATIENT);
const departments = db.collection<Department>(collections.DEPARTMENT);
const appointment = db.collection<Appointment>(collections.APPOINTMENT);
const opd = db.collection<Opd>(collections.OPD);

const DBCollections = { doctors, patients, departments, appointment, opd };

export default DBCollections;
