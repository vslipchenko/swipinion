import {userFavoritesQueryResolvers, userFavoritesQueryTypeDefinitions} from './user-favorites.queries';
import {userFavoritesInputs} from './user-favorites.inputs';

export const userFavoritesTypeDefinitions = [userFavoritesInputs, userFavoritesQueryTypeDefinitions];

export const userFavoritesResolvers = [userFavoritesQueryResolvers];