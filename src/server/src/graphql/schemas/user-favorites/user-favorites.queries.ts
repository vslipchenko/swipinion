import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard, expiredAccessTokenError} from '../../../utilities/guard';
import {db} from '../../../data';
import {USER_OPINION_FETCH_LIMIT} from '../../../constants/opinions';
import {queryFavoritesByUserId} from '../../../data/queries/user-favorites';
import {getUserRecordsValidator} from '../../../validators/shared';
import {composeQueryPayload} from '../../../utilities/query';

export const userFavoritesQueryTypeDefinitions = gql`
  type Query {
    getFavoritesByUserId(input: GetUserFavorites!): [Opinion!]
  }
`;

const getFavoritesByUserId = async (
  _: unknown,
  {input}: {input: {userId: string; edgeId: string}},
  {accessToken}: {accessToken: string},
): Promise<{exists: boolean} | null | Array<unknown> | ApolloError> => {
  const {error} = getUserRecordsValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  // Expired access token guard
  if (expiredAccessTokenError(authenticationError)) return authenticationError;

  const getFollowerId = (): string | undefined => {
    if (tokenData?.userId && tokenData.userId !== input.userId) return tokenData.userId;
  };

  const queryPayload = composeQueryPayload({
    $1: input.userId,
    $2: USER_OPINION_FETCH_LIMIT,
    edgeId: input.edgeId,
    followerId: getFollowerId(),
  });

  const result = await db.query(queryFavoritesByUserId(queryPayload, tokenData?.userId === input.userId));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userFavoritesQueryResolvers = {
  Query: {
    getFavoritesByUserId,
  },
};
