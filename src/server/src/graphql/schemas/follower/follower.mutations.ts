import {ApolloError, gql} from 'apollo-server-core';
import {bigintValidator} from '../../../validators/shared';
import {authenticationGuard} from '../../../utilities/guard';
import {queryFollowUser, queryUnfollowUser} from '../../../data/queries/follower';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {db} from '../../../data';

export const followerMutationTypeDefinitions = gql`
  type Mutation {
    followUser(userId: String!): FollowingPendingStatus
    unfollowUser(userId: String!): Success
  }
`;

const followUser = async (
  _: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<{pending: boolean} | ApolloError | null> => {
  const {error} = bigintValidator.validate(userId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<{pending: boolean}>(queryFollowUser(userId, tokenData.userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

const unfollowUser = async (
  _: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(userId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUnfollowUser(userId, tokenData.userId));

  return {success: Boolean(result.rowCount)};
};

export const followerMutationResolvers = {
  Mutation: {
    followUser,
    unfollowUser,
  },
};
