import {userMessagesMutationResolvers, userMessagesMutationTypeDefinitions} from './user-messages.mutations';
import {userMessagesInputs} from './user-messages.inputs';
import {userMessagesQueryResolvers, userMessagesQueryTypeDefinitions} from './user-messages.queries';

export const userMessagesTypeDefinitions = [
  userMessagesInputs,
  userMessagesQueryTypeDefinitions,
  userMessagesMutationTypeDefinitions,
];

export const userMessagesResolvers = [userMessagesQueryResolvers, userMessagesMutationResolvers];
