import {makeExecutableSchema} from '@graphql-tools/schema';
import {merge} from "lodash";
import {userResolvers, userTypeDefinitions} from "./schemas/user/user.schema";
import {sharedTypeDefinitions} from "./schemas/shared/shared.schema";

export const schema = makeExecutableSchema({
  typeDefs: [
    sharedTypeDefinitions,
    userTypeDefinitions
  ],
  resolvers: merge(
    {},
    ...userResolvers
  ),
});
