import {emailValidator, passwordValidator} from './shared';
import Joi from 'joi';

export const signInValidator = Joi.object({
  email: emailValidator,
  password: passwordValidator,
});
