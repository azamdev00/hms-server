export interface PatientLogin {
  cnic: string;
  password: string;
}

export interface DoctorLogin {
  cnic: string;
  password: string;
}

export interface Login {
  cnic: string;
  role: "doctor" | "admin";
  password: string;
}
