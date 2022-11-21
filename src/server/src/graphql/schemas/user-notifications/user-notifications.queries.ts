import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryMarkUserNotificationsRead, queryUserNotifications} from '../../../data/queries/user-notifications';
import {QueryResultRow} from 'pg';
import {userNotificationsValidator} from '../../../validators/user-notifications';

export const userNotificationsQueryTypeDefinitions = gql`
  type Query {
    userNotifications(input: UserNotificationsInput!): [Notification!]
  }
`;

const userNotifications = async (
  _1: unknown,
  {input}: {input: {edgeId: string; markRead: boolean}},
  {accessToken}: {accessToken: string},
): Promise<Array<QueryResultRow> | ApolloError | null> => {
  const {error} = userNotificationsValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  if (input.markRead) {
    const result = await db.transaction(
      queryMarkUserNotificationsRead(tokenData.userId),
      queryUserNotifications(tokenData.userId, input.edgeId),
    );

    return result.results[1].rows;
  }

  const result = await db.query(queryUserNotifications(tokenData.userId, input.edgeId));

  return result.rows;
};

export const userNotificationsQueryResolvers = {
  Query: {
    userNotifications,
  },
};
