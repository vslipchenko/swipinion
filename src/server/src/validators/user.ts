import Joi from 'joi';
import {codeValidator, emailValidator, languageValidator, passwordValidator, usernameValidator} from './shared';

export const userCodeValidator = Joi.object({
  email: emailValidator,
  code: codeValidator,
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
