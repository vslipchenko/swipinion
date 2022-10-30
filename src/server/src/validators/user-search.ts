import Joi from 'joi';
import {USERNAME_MAX_LENGTH, USERNAME_REGEXP} from '../constants/validation';

export const userSearchValidator = Joi.string().regex(USERNAME_REGEXP).max(USERNAME_MAX_LENGTH);
