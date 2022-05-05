import {Language} from '../i18n/i18n.types';

export interface AccessTokenData {
  userId: string;
  language: Language;
}

export interface SignIn {
  email: string;
  password: string;
}
