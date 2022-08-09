import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryFetchUserMessages} from '../../../data/queries/user-messages';
import {unixTimestampValidator} from '../../../validators/shared';

export const userMessagesQueryTypeDefinitions = gql`
  type Query {
    fetchUserMessages(startDate: Float): [Message!]
  }
`;

const fetchUserMessages = async (
  _1: unknown,
  {startDate}: {startDate: number},
  {accessToken}: {accessToken: string},
): Promise<Array<unknown> | ApolloError | null> => {
  const {error} = unixTimestampValidator.validate(startDate);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<unknown>(
    queryFetchUserMessages(tokenData.userId, startDate ? new Date(startDate).toISOString() : 'NOW()'),
  );

  if (!result.rowCount) return null;

  return result.rows;
};

export const userMessagesQueryResolvers = {
  Query: {
    fetchUserMessages,
  },
};
