import {makeExecutableSchema} from '@graphql-tools/schema';
import {merge} from 'lodash';
import {userResolvers, userTypeDefinitions} from './schemas/user/user.schema';
import {sharedTypeDefinitions} from './schemas/shared/shared.schema';
import {authenticationResolvers, authenticationTypeDefinitions} from './schemas/authentication/authentication.schema';
import {opinionResolvers, opinionTypeDefinitions} from './schemas/opinion/opinion.schema';
import {profileResolvers, profileTypeDefinitions} from './schemas/profile/profile.schema';
import {userFollowerResolvers, userFollowerTypeDefinitions} from './schemas/user-follower/user-follower.schema';
import {userSettingsResolvers, userSettingsTypeDefinitions} from './schemas/user-settings/user-settings.schema';
import {
  userNotificationsResolvers,
  userNotificationsTypeDefinitions,
} from './schemas/user-notifications/user-notifications.schema';
import {appResolvers, appTypeDefinitions} from './schemas/app/app.schema';

export const schema = makeExecutableSchema({
  typeDefs: [
    sharedTypeDefinitions,
    appTypeDefinitions,
    userTypeDefinitions,
    authenticationTypeDefinitions,
    opinionTypeDefinitions,
    profileTypeDefinitions,
    userFollowerTypeDefinitions,
    userSettingsTypeDefinitions,
    userNotificationsTypeDefinitions,
  ],
  resolvers: merge(
    {},
    ...appResolvers,
    ...userResolvers,
    ...authenticationResolvers,
    ...opinionResolvers,
    ...profileResolvers,
    ...userFollowerResolvers,
    ...userSettingsResolvers,
    ...userNotificationsResolvers,
  ),
});
