import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryFetchUserMessages} from '../../../data/queries/user-messages';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(startDate: String): [Message!]
  }
`;

const fetchUserMessages = async (
  _1: unknown,
  {startDate}: {startDate: string},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  // TODO add startDate validator
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<unknown>(queryFetchUserMessages(tokenData.userId, startDate));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
  },
};
