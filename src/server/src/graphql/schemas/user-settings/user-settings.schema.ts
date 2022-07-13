import {userSettingsQueryResolvers, userSettingsQueryTypeDefinitions} from './user-settings.queries';
import {userSettingsTypes} from './user-settings.types';
import {userSettingsInputs} from './user-settings.inputs';
import {userSettingsMutationResolvers, userSettingsMutationTypeDefinitions} from './user-settings.mutations';

export const userSettingsTypeDefinitions = [
  userSettingsInputs,
  userSettingsTypes,
  userSettingsQueryTypeDefinitions,
  userSettingsMutationTypeDefinitions,
];

export const userSettingsResolvers = [userSettingsQueryResolvers, userSettingsMutationResolvers];
