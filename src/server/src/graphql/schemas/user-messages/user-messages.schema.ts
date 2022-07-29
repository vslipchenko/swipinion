import {userMessagesMutationResolvers, userMessagesMutationTypeDefinitions} from './user-messages.mutations';
import {userMessagesInputs} from './user-messages.inputs';

export const userMessagesTypeDefinitions = [userMessagesInputs, userMessagesMutationTypeDefinitions];

export const userMessagesResolvers = [userMessagesMutationResolvers];
