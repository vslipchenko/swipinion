import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';

export const userNotificationsQueryTypeDefinitions = gql`
  type Query {
    userNotifications: String
  }
`;

const userNotifications = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<unknown | ApolloError | null> => {
  const {error, tokenData} = authenticationGuard(accessToken);

  if (error) return error;
};

export const userNotificationsQueryResolvers = {
  Query: {
    userNotifications,
  },
};
