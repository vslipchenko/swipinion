import Joi from 'joi';
import {booleanValidator} from './shared';

export const checkUserStatusValidator = Joi.object({
  checkMessage: booleanValidator,
  checkNotification: booleanValidator,
});
