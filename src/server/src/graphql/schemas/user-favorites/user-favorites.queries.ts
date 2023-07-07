import {gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {USER_OPINION_FETCH_LIMIT} from '../../../constants/opinions';
import {queryFavoritesByUsername} from '../../../data/queries/user-favorites';
import {getUserRecordsValidator} from '../../../validators/shared';
import {createQueryPayload} from '../../../utilities/query';

export const userFavoritesQueryTypeDefinitions = gql`
  type Query {
    getFavoritesByUsername(input: GetFavorites!): [Opinion!]
  }
`;

const getFavoritesByUsername = async (
  _: unknown,
  {input}: {input: {username: string; edgeId: string}},
  {accessToken}: {accessToken: string},
): Promise<{exists: boolean} | null | Array<unknown>> => {
  const {error} = getUserRecordsValidator.validate(input);

  if (error) return null;

  const {tokenData} = authenticationGuard(accessToken);

  const queryPayload = createQueryPayload({
    _1: input.username,
    _2: USER_OPINION_FETCH_LIMIT,
    edgeId: input.edgeId,
    followerId: tokenData?.userId,
  });

  const result = await db.query(queryFavoritesByUsername(queryPayload));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userFavoritesQueryResolvers = {
  Query: {
    getFavoritesByUsername,
  },
};
