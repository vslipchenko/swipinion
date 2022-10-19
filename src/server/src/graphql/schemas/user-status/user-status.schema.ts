import {userStatusQueryResolvers, userStatusQueryTypeDefinitions} from './user-status.queries';
import {userStatusTypes} from './user-status.types';
// import {userStatusInputs} from './user-status.inputs';

export const userStatusTypeDefinitions = [
  // userStatusInputs,
  userStatusTypes,
  userStatusQueryTypeDefinitions,
];

export const userStatusResolvers = [userStatusQueryResolvers];
