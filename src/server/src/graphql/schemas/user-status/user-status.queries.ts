import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryMessageUserStatus, queryNotificationUserStatus} from '../../../data/queries/user-status';
import {checkUserStatusValidator} from '../../../validators/user-status';
import {QueryResultRow} from 'pg';

export const userStatusQueryTypeDefinitions = gql`
  type Query {
    checkUserStatus(input: UserStatusCheck!): UserStatus
  }
`;

const checkUserStatus = async (
  _1: unknown,
  {input}: {input: {checkMessage: boolean; checkNotification: boolean}},
  {accessToken}: {accessToken: string},
): Promise<{unreadMessages?: Array<QueryResultRow>; unreadNotification?: string} | ApolloError | null> => {
  const {error} = checkUserStatusValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  if (input.checkMessage && input.checkNotification) {
    const unreadMessages = await db.query(queryMessageUserStatus(tokenData.userId));
    const unreadNotification = await db.query(queryNotificationUserStatus(tokenData.userId));

    return {
      unreadMessages: unreadMessages.rows,
      unreadNotification: unreadNotification.rows[0]?.id,
    };
  } else if (input.checkMessage) {
    const result = await db.query(queryMessageUserStatus(tokenData.userId));

    return {
      unreadMessages: result.rows,
    };
  }

  // input.checkNotification
  const result = await db.query(queryNotificationUserStatus(tokenData.userId));

  return {
    unreadNotification: result.rows[0]?.id,
  };
};

export const userStatusQueryResolvers = {
  Query: {
    checkUserStatus,
  },
};
