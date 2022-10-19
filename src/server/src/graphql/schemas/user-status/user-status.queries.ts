import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryMessageUserStatus, queryNotificationUserStatus} from '../../../data/queries/user-status';
import {QueryResultRow} from 'pg';
import {booleanValidator} from '../../../validators/shared';

export const userStatusQueryTypeDefinitions = gql`
  type Query {
    checkUserStatus(checkMessage: Boolean!): UserStatus
  }
`;

const checkUserStatus = async (
  _1: unknown,
  {checkMessage}: {checkMessage: boolean},
  {accessToken}: {accessToken: string},
): Promise<{unreadMessages?: Array<QueryResultRow>; unreadNotification?: string} | ApolloError | null> => {
  const {error} = booleanValidator.validate(checkMessage);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  if (!checkMessage) {
    const result = await db.query(queryNotificationUserStatus(tokenData.userId));

    return {
      unreadNotification: result.rows[0]?.id,
    };
  }

  const result = await db.transaction(
    queryMessageUserStatus(tokenData.userId),
    queryNotificationUserStatus(tokenData.userId),
  );

  return {
    unreadMessages: result.results?.[0]?.rows,
    unreadNotification: result.results?.[1]?.rows[0]?.id,
  };
};

export const userStatusQueryResolvers = {
  Query: {
    checkUserStatus,
  },
};
