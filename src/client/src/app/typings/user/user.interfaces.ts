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

export interface SetNewPassword {
  email: string;
  code: string;
  password: string;
}

// export interface VerifyRecoveryCode {
//   email: string;
//   code: string;
// }

export interface RecoverPasswordMutationResult {
  recoverPassword: SuccessResponse;
}

export interface SetNewPasswordMutationResult {
  setNewPassword: SuccessResponse;
}

export interface UserWithRecoveryCodeExistsQueryResult {
  userWithRecoveryCodeExists: ExistsResponse;
}

export interface UserCode {
  email: string;
  code: string;
}

export interface ConfirmEmailMutationResult {
  confirmEmail: SuccessResponse;
}
