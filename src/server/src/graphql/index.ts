import {makeExecutableSchema} from '@graphql-tools/schema';
import {merge} from 'lodash';
import {userResolvers, userTypeDefinitions} from './schemas/user/user.schema';
import {sharedTypeDefinitions} from './schemas/shared/shared.schema';
import {authenticationResolvers, authenticationTypeDefinitions} from './schemas/authentication/authentication.schema';

export const schema = makeExecutableSchema({
  typeDefs: [sharedTypeDefinitions, userTypeDefinitions, authenticationTypeDefinitions],
  resolvers: merge({}, ...userResolvers, ...authenticationResolvers),
});
