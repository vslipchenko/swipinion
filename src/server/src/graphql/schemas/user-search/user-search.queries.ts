import {ApolloError, gql} from 'apollo-server-core';
import {db} from '../../../data';
import {authenticationGuard} from '../../../utilities/guard';
import {QueryResultRow} from 'pg';
import {usernameValidator} from '../../../validators/shared';
import {queryUserSearchByUsername} from '../../../data/queries/user-search';

export const userSearchQueryTypeDefinitions = gql`
  type Query {
    userSearch(username: String!): UserEssentials
  }
`;

const userSearch = async (
  _1: unknown,
  {username}: {username: string},
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  const {error} = usernameValidator.validate(username);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUserSearchByUsername(username, tokenData.userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userSearchQueryResolvers = {
  Query: {
    userSearch,
  },
};
