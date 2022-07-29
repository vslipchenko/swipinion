import {ApolloError, gql} from 'apollo-server-core';
import {ExistsResponse} from '../../../typings/response/response.interfaces';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryUnreadUserMessageExists} from '../../../data/queries/user-messages';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    checkUnreadUserMessageExists: Exists
  }
`;

const checkUnreadUserMessageExists = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<ExistsResponse | ApolloError | null> => {
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUnreadUserMessageExists(tokenData.userId));

  return {exists: Boolean(result.rowCount)};
};

export const userMessagesQueryResolvers = {
  Query: {
    checkUnreadUserMessageExists,
  },
};