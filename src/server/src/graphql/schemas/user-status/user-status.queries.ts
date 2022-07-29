import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryUserStatus} from '../../../data/queries/user-status';

export const userStatusQueryTypeDefinitions = gql`
  type Query {
    checkUserStatus: UserStatus
  }
`;

const checkUserStatus = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<{unreadMessage: boolean; unreadNotification: boolean} | ApolloError | null> => {
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<{receiver_id: boolean; user_id: boolean}>(queryUserStatus(tokenData.userId));

  if (!result.rowCount) return {unreadMessage: false, unreadNotification: false};

  return {
    unreadMessage: Boolean(result.rows[0].receiver_id),
    unreadNotification: Boolean(result.rows[0].user_id),
  };
};

export const userStatusQueryResolvers = {
  Query: {
    checkUserStatus,
  },
};
