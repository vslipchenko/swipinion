import {opinionMutationResolvers, opinionMutationTypeDefinitions} from './opinion.mutations';
import {opinionInputs} from './opinion.inputs';
import {opinionQueryResolvers, opinionQueryTypeDefinitions} from './opinion.queries';
import {opinionTypes} from './opinion.types';

export const opinionTypeDefinitions = [
  opinionTypes,
  opinionInputs,
  opinionQueryTypeDefinitions,
  opinionMutationTypeDefinitions,
];

export const opinionResolvers = [opinionQueryResolvers, opinionMutationResolvers];
