import {userMessagesMutationResolvers, userMessagesMutationTypeDefinitions} from './user-messages.mutations';
import {userMessagesInputs} from './user-messages.inputs';
import {userMessagesQueryResolvers, userMessagesQueryTypeDefinitions} from './user-messages.queries';
import {userMessagesTypes} from './user-messages.types';

export const userMessagesTypeDefinitions = [
  userMessagesTypes,
  userMessagesInputs,
  userMessagesQueryTypeDefinitions,
  userMessagesMutationTypeDefinitions,
];

export const userMessagesResolvers = [userMessagesQueryResolvers, userMessagesMutationResolvers];
