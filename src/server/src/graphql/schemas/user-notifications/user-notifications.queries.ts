import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryUserNotifications} from '../../../data/queries/user-notifications';
import {offsetValidator} from '../../../validators/shared';
import {Notification} from '../../../typings/user-notifications/user-notifications.interfaces';

export const userNotificationsQueryTypeDefinitions = gql`
  type Query {
    userNotifications(offset: Float!): [Notification!]
  }
`;

const userNotifications = async (
  _1: unknown,
  {offset}: {offset: number},
  {accessToken}: {accessToken: string},
): Promise<Array<Notification> | ApolloError | null> => {
  const {error} = offsetValidator.validate(offset);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<Array<Notification>>(queryUserNotifications(tokenData.userId, offset));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userNotificationsQueryResolvers = {
  Query: {
    userNotifications,
  },
};
