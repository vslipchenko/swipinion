import Joi from 'joi';
import {
  BIGINT_REGEXP,
  CODE_REGEXP,
  EMAIL_REGEXP,
  FILE_URL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
  USER_MESSAGE_MAX_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEXP,
} from '../constants/validation';
import {getStringEnumValues} from '../utilities/enum';
import {LanguageLabel} from '../typings/i18n/i18n.enums';

export const bigintValidator = Joi.string().regex(BIGINT_REGEXP);
export const usernameValidator = Joi.string().regex(USERNAME_REGEXP).min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH);
export const emailValidator = Joi.string().regex(EMAIL_REGEXP);
export const codeValidator = Joi.string().pattern(CODE_REGEXP);
export const passwordValidator = Joi.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH).regex(PASSWORD_REGEXP);
export const languageValidator = Joi.string().valid(...getStringEnumValues(LanguageLabel));
// export const offsetValidator = Joi.number().min(0);
export const fileUrlValidator = Joi.string().max(FILE_URL_MAX_LENGTH).allow(null);
export const unixTimestampValidator = Joi.date().timestamp('unix');
export const booleanValidator = Joi.boolean();
export const messageBodyValidator = Joi.string().trim().min(1).max(USER_MESSAGE_MAX_LENGTH);
export const getUserRecordsValidator = Joi.object<unknown>({
  userId: bigintValidator,
  edgeId: bigintValidator,
});
