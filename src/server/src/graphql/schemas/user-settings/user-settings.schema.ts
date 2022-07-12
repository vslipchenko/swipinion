import {userSettingsQueryResolvers, userSettingsQueryTypeDefinitions} from './user-settings.queries';
import {userSettingsTypes} from './user-settings.types';

export const userSettingsTypeDefinitions = [userSettingsTypes, userSettingsQueryTypeDefinitions];

export const userSettingsResolvers = [userSettingsQueryResolvers];
