export type ResponseCode =
  | "url_not_found"
  | "server_error"
  | "ok"
  | "unauthenticated"
  | "authenticated"
  | "unauthorized"
  | "forbidden"
  | "user_not_found"
  | "patient_not_found"
  | "doctor_not_found"
  | "already_logged_in"
  | "invalid_req_body"
  | "invalid_credentials"
  | "jwt_error"
  | "created"
  | "updated"
  | "deleted"
  | "duplicate_key"
  | "invalid_req_query"
  | "invalid_req_params"
  | "verification_token_error"
  | "email_already_verified"
  | "email_mismatch"
  | "collaborator_not_found"
  | "no_user_role"
  | "username_already_taken"
  | "email_already_taken"
  | "cnic_already_taken"
  | "department_name_already_taken"
  | "new_email_not_found"
  | "current_password_incorrect"
  | "passwords_mismatch"
  | "record_not_found"
  | "opd_not_found"
  | "opd_joined"
  | "opd_left"
  | "doctor_already_assigned"
  | "invalid_user";

export interface ResponseObject {
  status: "success" | "fail" | "error";
  code: ResponseCode;
  message: string;
  [key: string]: any;
}
