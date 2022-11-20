import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryUserNotifications} from '../../../data/queries/user-notifications';
import {bigintValidator} from '../../../validators/shared';
import {QueryResultRow} from 'pg';

export const userNotificationsQueryTypeDefinitions = gql`
  type Query {
    userNotifications(edgeId: String): [Notification!]
  }
`;

const userNotifications = async (
  _1: unknown,
  {edgeId}: {edgeId: string},
  {accessToken}: {accessToken: string},
): Promise<Array<QueryResultRow> | ApolloError | null> => {
  const {error} = bigintValidator.validate(edgeId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUserNotifications(tokenData.userId, edgeId));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userNotificationsQueryResolvers = {
  Query: {
    userNotifications,
  },
};
