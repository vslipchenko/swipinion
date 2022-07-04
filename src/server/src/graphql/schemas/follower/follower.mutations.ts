import {ApolloError, gql} from 'apollo-server-core';
import {bigintValidator, usernameValidator} from '../../../validators/shared';
import {authenticationGuard} from '../../../utilities/guard';
import {queryFollowUser} from '../../../data/queries/follower';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {db} from '../../../data';

export const followerMutationTypeDefinitions = gql`
  type Mutation {
    followUser(userId: String!): Success
    unfollowUser(username: String!): Success
  }
`;

const followUser = async (
  _: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(userId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryFollowUser(userId, tokenData.userId));

  return {success: Boolean(result.rowCount)};
};

const unfollowUser = async (
  _: unknown,
  {username}: {username: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = usernameValidator.validate(username);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  return null;
};

export const followerMutationResolvers = {
  Mutation: {
    followUser,
    unfollowUser,
  },
};
