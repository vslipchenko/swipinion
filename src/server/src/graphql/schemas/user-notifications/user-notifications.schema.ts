import {userNotificationsQueryResolvers, userNotificationsQueryTypeDefinitions} from './user-notifications.queries';
import {userNotificationsTypes} from './user-notifications.types';
import {
  userNotificationsMutationResolvers,
  userNotificationsMutationTypeDefinitions,
} from './user-notifications.mutations';
import {userNotificationsInputs} from './user-notifications.inputs';

export const userNotificationsTypeDefinitions = [
  userNotificationsTypes,
  userNotificationsInputs,
  userNotificationsQueryTypeDefinitions,
  userNotificationsMutationTypeDefinitions,
];

export const userNotificationsResolvers = [userNotificationsQueryResolvers, userNotificationsMutationResolvers];
