import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {bigintValidator} from '../../../validators/shared';
import {queryDeleteNotificationById} from '../../../data/queries/user-notifications';
import {SuccessResponse} from '../../../typings/response/response.interfaces';

export const userNotificationsMutationTypeDefinitions = gql`
  type Mutation {
    deleteUserNotification(id: String!): Success
  }
`;

const deleteUserNotification = async (
  _: unknown,
  {id}: {id: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(id);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryDeleteNotificationById(id, tokenData.userId));

  return {success: Boolean(result.rowCount)};
};

export const userNotificationsMutationResolvers = {
  Mutation: {
    deleteUserNotification,
  },
};
