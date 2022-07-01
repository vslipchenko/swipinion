import {makeExecutableSchema} from '@graphql-tools/schema';
import {merge} from 'lodash';
import {userResolvers, userTypeDefinitions} from './schemas/user/user.schema';
import {sharedTypeDefinitions} from './schemas/shared/shared.schema';
import {authenticationResolvers, authenticationTypeDefinitions} from './schemas/authentication/authentication.schema';
import {opinionResolvers, opinionTypeDefinitions} from './schemas/opinion/opinion.schema';
import {profileResolvers, profileTypeDefinitions} from './schemas/profile/profile.schema';
import {followerResolvers, followerTypeDefinitions} from './schemas/follower/follower.schema';

export const schema = makeExecutableSchema({
  typeDefs: [
    sharedTypeDefinitions,
    userTypeDefinitions,
    authenticationTypeDefinitions,
    opinionTypeDefinitions,
    profileTypeDefinitions,
    followerTypeDefinitions,
  ],
  resolvers: merge(
    {},
    ...userResolvers,
    ...authenticationResolvers,
    ...opinionResolvers,
    ...profileResolvers,
    ...followerResolvers,
  ),
});
