import Joi from 'joi';
import {emailValidator, languageValidator, passwordValidator, usernameValidator} from './shared';
import {EMAIL_CONFIRMATION_CODE_REGEXP} from '../constants/validation';

export const confirmEmailValidator = Joi.object({
  email: emailValidator,
  code: Joi.string().pattern(EMAIL_CONFIRMATION_CODE_REGEXP),
});
export const createUserValidator = Joi.object({
  username: usernameValidator,
  email: emailValidator,
  password: passwordValidator,
  language: languageValidator,
});

export const recoverPasswordValidator = Joi.object({
  email: emailValidator,
  language: languageValidator,
});
