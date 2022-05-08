import {Language} from '../i18n/i18n.types';

export interface CreateUser {
  username: string;
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

export interface SetNewPassword {
  email: string;
  code: string;
  password: string;
}
