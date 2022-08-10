import Joi from 'joi';
import {bigintValidator, booleanValidator, unixTimestampValidator} from './shared';
import {FetchUserChatPayload} from '../typings/user-messages/user-messages.interfaces';

export const sendUserMessageValidator = Joi.object({
  receiverId: bigintValidator,
  body: Joi.string().max(3000),
});

export const fetchUserChatValidator = Joi.object<FetchUserChatPayload>({
  user_id_1: bigintValidator,
  user_id_2: bigintValidator,
  startDate: unixTimestampValidator,
  markRead: booleanValidator,
});
