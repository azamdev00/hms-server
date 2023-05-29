import { getDb } from "../db/conn";
import { Patient } from "../models/patient";

const db = getDb();

export const collections = {
  PATIENT: "patient",
};

const patients = db.collection<Patient>(collections.PATIENT);

const DBCollections = { patients };

export default DBCollections;
