import {userSearchQueryResolvers, userSearchQueryTypeDefinitions} from './user-search.queries';
import {userSearchTypes} from './user-search.types';

export const userSearchTypeDefinitions = [userSearchTypes, userSearchQueryTypeDefinitions];

export const userSearchResolvers = [userSearchQueryResolvers];
