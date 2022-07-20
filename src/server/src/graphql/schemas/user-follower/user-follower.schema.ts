import {userFollowerMutationResolvers, userFollowerMutationTypeDefinitions} from './user-follower.mutations';
import {userFollowerTypes} from './user-follower.types';

export const userFollowerTypeDefinitions = [userFollowerTypes, userFollowerMutationTypeDefinitions];

export const userFollowerResolvers = [userFollowerMutationResolvers];
