import {Language} from "../i18n/i18n.types";

export interface CreateUser {
  email: string;
  password: string;
  language: Language;
}

export interface RecoverPassword {
  email: string;
  language: Language;
}

export interface ResetPassword {
  password: string;
  key: string;
}
