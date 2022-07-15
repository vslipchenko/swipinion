import {followerMutationResolvers, followerMutationTypeDefinitions} from './follower.mutations';
import {followerTypes} from './follower.types';

export const followerTypeDefinitions = [followerTypes, followerMutationTypeDefinitions];

export const followerResolvers = [followerMutationResolvers];
