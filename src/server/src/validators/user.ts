import Joi from "joi";
import {emailValidator, languageValidator, passwordValidator} from "./shared";
import {UUID_REGEXP} from "../constants/validation";

export const confirmationKeyValidator = Joi.string().pattern(UUID_REGEXP);
export const createUserValidator = Joi.object({
  email: emailValidator,
  password: passwordValidator,
  language: languageValidator,
});

export const recoverPasswordValidator = Joi.object({
  email: emailValidator,
  language: languageValidator,
});
