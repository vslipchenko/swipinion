import Joi from 'joi';
import {bigintValidator, booleanValidator, messageBodyValidator} from './shared';
import {FetchUserConversationPayload} from '../typings/user-messages/user-messages.interfaces';

export const sendUserMessageValidator = Joi.object({
  edgeId: bigintValidator,
  recipientId: bigintValidator,
  body: messageBodyValidator, // No empty/whitespace string
});

export const fetchUserConversationValidator = Joi.object<FetchUserConversationPayload>({
  user_id_1: bigintValidator,
  user_id_2: bigintValidator,
  edgeId: bigintValidator,
  fetchNew: booleanValidator,
  markRead: booleanValidator,
});

export const fetchNewUserMessagesValidator = Joi.array().items(bigintValidator);
