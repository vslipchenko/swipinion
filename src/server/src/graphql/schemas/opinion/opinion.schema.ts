import {opinionMutationResolvers, opinionMutationTypeDefinitions} from './opinion.mutations';
import {opinionInputs} from './opinion.inputs';

export const opinionTypeDefinitions = [opinionInputs, opinionMutationTypeDefinitions];

export const opinionResolvers = [opinionMutationResolvers];
