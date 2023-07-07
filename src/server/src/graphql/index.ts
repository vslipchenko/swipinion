import {makeExecutableSchema} from '@graphql-tools/schema';
import {merge} from 'lodash';
import {userResolvers, userTypeDefinitions} from './schemas/user/user.schema';
import {sharedTypeDefinitions} from './schemas/shared/shared.schema';
import {authenticationResolvers, authenticationTypeDefinitions} from './schemas/authentication/authentication.schema';
import {userOpinionResolvers, userOpinionTypeDefinitions} from './schemas/user-opinion/user-opinion.schema';
import {profileResolvers, profileTypeDefinitions} from './schemas/profile/profile.schema';
import {userFollowerResolvers, userFollowerTypeDefinitions} from './schemas/user-follower/user-follower.schema';
import {userSettingsResolvers, userSettingsTypeDefinitions} from './schemas/user-settings/user-settings.schema';
import {
  userNotificationsResolvers,
  userNotificationsTypeDefinitions,
} from './schemas/user-notifications/user-notifications.schema';
import {appResolvers, appTypeDefinitions} from './schemas/app/app.schema';
import {userMessagesResolvers, userMessagesTypeDefinitions} from './schemas/user-messages/user-messages.schema';
import {userStatusResolvers, userStatusTypeDefinitions} from './schemas/user-status/user-status.schema';
import {userSearchResolvers, userSearchTypeDefinitions} from './schemas/user-search/user-search.schema';
import {opinionResolvers, opinionTypeDefinitions} from './schemas/opinion/opinion.schema';
import {userFavoritesResolvers, userFavoritesTypeDefinitions} from './schemas/user-favorites/user-favorites.schema';

export const schema = makeExecutableSchema({
  typeDefs: [
    sharedTypeDefinitions,
    appTypeDefinitions,
    userTypeDefinitions,
    authenticationTypeDefinitions,
    userOpinionTypeDefinitions,
    profileTypeDefinitions,
    userFollowerTypeDefinitions,
    userSettingsTypeDefinitions,
    userNotificationsTypeDefinitions,
    userMessagesTypeDefinitions,
    userStatusTypeDefinitions,
    userSearchTypeDefinitions,
    opinionTypeDefinitions,
    userFavoritesTypeDefinitions,
  ],
  resolvers: merge(
    {},
    ...appResolvers,
    ...userResolvers,
    ...authenticationResolvers,
    ...userOpinionResolvers,
    ...profileResolvers,
    ...userFollowerResolvers,
    ...userSettingsResolvers,
    ...userNotificationsResolvers,
    ...userMessagesResolvers,
    ...userStatusResolvers,
    ...userSearchResolvers,
    ...opinionResolvers,
    ...userFavoritesResolvers,
  ),
});
