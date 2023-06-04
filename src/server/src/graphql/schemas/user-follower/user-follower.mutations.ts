import {ApolloError, gql} from 'apollo-server-core';
import {bigintValidator} from '../../../validators/shared';
import {authenticationGuard} from '../../../utilities/guard';
import {
  queryAcceptFollowRequest,
  queryDeleteFollowRequest,
  queryFollowUser,
  queryUnfollowUser,
} from '../../../data/queries/user-follower';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {db} from '../../../data';
import {queryDeleteNotificationByFollowersRecordId} from '../../../data/queries/user-notifications';
import {QueryResultRow} from 'pg';
import {TransactionResult} from '../../../typings/data/data.interfaces';

export const userFollowerMutationTypeDefinitions = gql`
  type Mutation {
    followUser(userId: String!): FollowingPendingStatus
    unfollowUser(userId: String!): Success
    acceptFollowRequest(recordId: String!): Success
    declineFollowRequest(recordId: String!): Success
  }
`;

const followUser = async (
  _: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  const {error} = bigintValidator.validate(userId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  if (userId === tokenData.userId) return null; // Disallow self-follow

  const result = await db.query(queryFollowUser(userId, tokenData.userId));

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

const acceptFollowRequest = async (
  _: unknown,
  {recordId}: {recordId: string},
  {accessToken}: {accessToken: string},
): Promise<TransactionResult | ApolloError | null> => {
  const {error} = bigintValidator.validate(recordId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  return await db.transaction(
    queryAcceptFollowRequest(recordId, tokenData.userId),
    queryDeleteNotificationByFollowersRecordId(recordId, tokenData.userId),
  );
};

const declineFollowRequest = async (
  _: unknown,
  {recordId}: {recordId: string},
  {accessToken}: {accessToken: string},
): Promise<TransactionResult | ApolloError | null> => {
  const {error} = bigintValidator.validate(recordId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  return await db.transaction(
    queryDeleteFollowRequest(recordId, tokenData.userId),
    queryDeleteNotificationByFollowersRecordId(recordId, tokenData.userId),
  );
};

export const userFollowerMutationResolvers = {
  Mutation: {
    followUser,
    unfollowUser,
    acceptFollowRequest,
    declineFollowRequest,
  },
};
