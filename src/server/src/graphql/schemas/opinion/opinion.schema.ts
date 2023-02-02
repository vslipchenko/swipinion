import {opinionQueryResolvers, opinionQueryTypeDefinitions} from './opinion.queries';
import {opinionTypes} from './opinion.types';

export const opinionTypeDefinitions = [opinionTypes, opinionQueryTypeDefinitions];

export const opinionResolvers = [opinionQueryResolvers];
