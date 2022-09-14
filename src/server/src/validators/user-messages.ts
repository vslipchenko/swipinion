import Joi from 'joi';
import {bigintValidator, booleanValidator} from './shared';
import {FetchUserChatPayload} from '../typings/user-messages/user-messages.interfaces';

export const sendUserMessageValidator = Joi.object({
  recipientId: bigintValidator,
  body: Joi.string().trim().min(1).max(3000), // No empty/whitespace string
});

export const fetchUserChatValidator = Joi.object<FetchUserChatPayload>({
  user_id_1: bigintValidator,
  user_id_2: bigintValidator,
  edgeId: bigintValidator,
  markRead: booleanValidator,
});

export const fetchNewUserMessagesValidator = Joi.array().items(bigintValidator);
