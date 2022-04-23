import {userQueryResolvers, userQueryTypeDefinitions} from './user.queries';
import {userInputs} from './user.inputs';
import {userMutationResolvers, userMutationTypeDefinitions} from './user.mutations';

export const userTypeDefinitions = [userInputs, userQueryTypeDefinitions, userMutationTypeDefinitions];

export const userResolvers = [userQueryResolvers, userMutationResolvers];
