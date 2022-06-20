import Joi from 'joi';
import {
  codeValidator,
  emailValidator,
  fileUrlValidator,
  languageValidator,
  passwordValidator,
  usernameValidator,
} from './shared';
import {BIO_MAX_LENGTH} from '../constants/validation';

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

export const setNewPasswordValidator = Joi.object({
  email: emailValidator,
  code: codeValidator,
  password: passwordValidator,
});

export const editProfileValidator = Joi.object({
  thumbnail: fileUrlValidator,
  bio: Joi.string().max(BIO_MAX_LENGTH).allow(null),
});
