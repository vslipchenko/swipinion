import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  queryCompleteUserStatus,
  queryMessageUserStatus,
  queryNotificationUserStatus,
} from '../../../data/queries/user-status';

export const userStatusQueryTypeDefinitions = gql`
  type Query {
    checkUserStatus(input: UserStatusCheck!): UserStatus
  }
`;

const checkUserStatus = async (
  _1: unknown,
  {input}: {input: {checkMessage: boolean; checkNotification: boolean}},
  {accessToken}: {accessToken: string},
): Promise<{unreadMessage?: boolean; unreadNotification?: boolean} | ApolloError | null> => {
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  console.log(tokenData, new Date());

  if (authenticationError) return authenticationError;

  let result;

  if (input.checkMessage && input.checkNotification) {
    result = await db.query<{receiver_id: boolean; user_id: boolean}>(queryCompleteUserStatus(tokenData.userId));

    return {
      unreadMessage: Boolean(result.rows[0]?.receiver_id),
      unreadNotification: Boolean(result.rows[0]?.user_id),
    };
  } else if (input.checkMessage) {
    result = await db.query(queryMessageUserStatus(tokenData.userId));

    return {
      unreadMessage: Boolean(result.rowCount),
    };
  }

  // input.checkNotification
  result = await db.query(queryNotificationUserStatus(tokenData.userId));

  return {
    unreadNotification: Boolean(result.rowCount),
  };
};

export const userStatusQueryResolvers = {
  Query: {
    checkUserStatus,
  },
};
