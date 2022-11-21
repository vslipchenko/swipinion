import Joi from 'joi';
import {bigintValidator, booleanValidator} from './shared';

export const userNotificationsValidator = Joi.object({
  edgeId: bigintValidator,
  markRead: booleanValidator,
});