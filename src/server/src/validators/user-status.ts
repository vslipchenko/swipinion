import Joi from 'joi';

export const checkUserStatusValidator = Joi.object({
  checkMessage: Joi.boolean(),
  checkNotification: Joi.boolean(),
});