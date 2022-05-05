import {authenticationTypes} from './authentication.types';
import {authenticationInputs} from './authentication.inputs';
import {authenticationQueryResolvers, authenticationQueryTypeDefinitions} from './authentication.queries';

export const authenticationTypeDefinitions = [
  authenticationTypes,
  authenticationInputs,
  authenticationQueryTypeDefinitions,
];

export const authenticationResolvers = [authenticationQueryResolvers];
