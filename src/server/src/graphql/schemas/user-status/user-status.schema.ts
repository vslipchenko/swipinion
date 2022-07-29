import {userStatusQueryResolvers, userStatusQueryTypeDefinitions} from './user-status.queries';
import {userStatusTypes} from './user-status.types';

export const userStatusTypeDefinitions = [userStatusTypes, userStatusQueryTypeDefinitions];

export const userStatusResolvers = [userStatusQueryResolvers];
