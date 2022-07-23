import Joi from 'joi';
import {bigintValidator} from './shared';

export const sendUserMessageValidator = Joi.object({
  receiverId: bigintValidator,
  body: Joi.string().max(3000),
});