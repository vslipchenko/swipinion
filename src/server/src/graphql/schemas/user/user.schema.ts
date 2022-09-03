import {userQueryResolvers, userQueryTypeDefinitions} from './user.queries';
import {userInputs} from './user.inputs';
import {userMutationResolvers, userMutationTypeDefinitions} from './user.mutations';
import {userTypes} from './user.types';

export const userTypeDefinitions = [userTypes, userInputs, userQueryTypeDefinitions, userMutationTypeDefinitions];

export const userResolvers = [userQueryResolvers, userMutationResolvers];
