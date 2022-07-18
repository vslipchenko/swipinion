import {userNotificationsQueryResolvers, userNotificationsQueryTypeDefinitions} from './user-notifications.queries';
import {userNotificationsTypes} from './user-notifications.types';

export const userNotificationsTypeDefinitions = [userNotificationsTypes, userNotificationsQueryTypeDefinitions];

export const userNotificationsResolvers = [userNotificationsQueryResolvers];
