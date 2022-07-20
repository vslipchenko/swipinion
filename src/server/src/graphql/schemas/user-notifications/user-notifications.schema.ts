import {userNotificationsQueryResolvers, userNotificationsQueryTypeDefinitions} from './user-notifications.queries';
import {userNotificationsTypes} from './user-notifications.types';
import {
  userNotificationsMutationResolvers,
  userNotificationsMutationTypeDefinitions,
} from './user-notifications.mutations';

export const userNotificationsTypeDefinitions = [
  userNotificationsTypes,
  userNotificationsQueryTypeDefinitions,
  userNotificationsMutationTypeDefinitions,
];

export const userNotificationsResolvers = [userNotificationsQueryResolvers, userNotificationsMutationResolvers];
