import {profileQueryResolvers, profileQueryTypeDefinitions} from './profile.queries';
import {profileTypes} from './profile.types';

export const profileTypeDefinitions = [profileTypes, profileQueryTypeDefinitions];

export const profileResolvers = [profileQueryResolvers];
