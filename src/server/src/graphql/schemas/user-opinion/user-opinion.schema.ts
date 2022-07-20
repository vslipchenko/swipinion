import {userOpinionMutationResolvers, userOpinionMutationTypeDefinitions} from './user-opinion.mutations';
import {userOpinionInputs} from './user-opinion.inputs';
import {userOpinionQueryResolvers, userOpinionQueryTypeDefinitions} from './user-opinion.queries';
import {userOpinionTypes} from './user-opinion.types';

export const userOpinionTypeDefinitions = [
  userOpinionTypes,
  userOpinionInputs,
  userOpinionQueryTypeDefinitions,
  userOpinionMutationTypeDefinitions,
];

export const userOpinionResolvers = [userOpinionQueryResolvers, userOpinionMutationResolvers];
