import {Language} from '~app/typings/i18n/i18n.types';
import {ExistsResponse, SuccessResponse} from '~app/typings/response/response.interfaces';

export interface CreateUser {
  username: string;
  email: string;
  password: string;
  language: Language;
}

export interface CreateUserMutationResult {
  createUser: SuccessResponse;
}

export interface UserWithEmailExistsQueryResult {
  userWithEmailExists: ExistsResponse;
}

export interface UserWithUsernameExistsQueryResult {
  userWithUsernameExists: ExistsResponse;
}

export interface RecoverPassword {
  email: string;
  language: Language;
}

export interface RecoverPasswordMutationResult {
  recoverPassword: SuccessResponse;
}
