import {opinionQueryResolvers, opinionQueryTypeDefinitions} from './opinion.queries';
import {opinionTypes} from './opinion.types';
import {opinionInputs} from './opinion.inputs';
import {opinionMutationResolvers, opinionMutationTypeDefinitions} from './opinion.mutations';

export const opinionTypeDefinitions = [
  opinionTypes,
  opinionInputs,
  opinionQueryTypeDefinitions,
  opinionMutationTypeDefinitions,
];

export const opinionResolvers = [opinionQueryResolvers, opinionMutationResolvers];
