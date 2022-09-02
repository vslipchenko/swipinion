import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryCompleteUserStatus,
  queryMessageUserStatus,
  queryNotificationUserStatus,
} from '../../../data/queries/user-status';
import {checkUserStatusValidator} from '../../../validators/user-status';

export const userStatusQueryTypeDefinitions = gql`
  type Query {
    checkUserStatus(input: UserStatusCheck!): UserStatus
  }
`;

const checkUserStatus = async (
  _1: unknown,
  {input}: {input: {checkMessage: boolean; checkNotification: boolean}},
  {accessToken}: {accessToken: string},
): Promise<{unreadMessageTimestamp?: string; unreadNotificationTimestamp?: string} | ApolloError | null> => {
  const {error} = checkUserStatusValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  let result;

  if (input.checkMessage && input.checkNotification) {
    result = await db.query(queryCompleteUserStatus(tokenData.userId));

    return {
      unreadMessageTimestamp: result.rows[0]?.message_created_at,
      unreadNotificationTimestamp: result.rows[0]?.notification_created_at,
    };
  } else if (input.checkMessage) {
    result = await db.query(queryMessageUserStatus(tokenData.userId));

    return {
      unreadMessageTimestamp: result.rows[0]?.message_created_at,
    };
  }

  // input.checkNotification
  result = await db.query(queryNotificationUserStatus(tokenData.userId));

  return {
    unreadNotificationTimestamp: result.rows[0]?.notification_created_at,
  };
};

export const userStatusQueryResolvers = {
  Query: {
    checkUserStatus,
  },
};
