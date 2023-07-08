import {gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryOpinionsByUserId} from '../../../data/queries/user-opinion';
import {authenticationGuard} from '../../../utilities/guard';
import {USER_OPINION_FETCH_LIMIT} from '../../../constants/opinions';
import {getUserRecordsValidator} from '../../../validators/shared';
import {composeQueryPayload} from '../../../utilities/query';

export const userOpinionQueryTypeDefinitions = gql`
  type Query {
    getOpinionsByUserId(input: GetOpinions!): [UserOpinion!]
  }
`;

const getOpinionsByUserId = async (
  _: unknown,
  {input}: {input: {userId: string; edgeId: string}},
  {accessToken}: {accessToken: string},
): Promise<{exists: boolean} | null | Array<unknown>> => {
  const {error} = getUserRecordsValidator.validate(input);

  if (error) return null;

  const {tokenData} = authenticationGuard(accessToken);

  const queryPayload = composeQueryPayload({
    $1: input.userId,
    $2: USER_OPINION_FETCH_LIMIT,
    edgeId: input.edgeId,
    followerId: tokenData?.userId,
  });

  const result = await db.query(queryOpinionsByUserId(queryPayload));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userOpinionQueryResolvers = {
  Query: {
    getOpinionsByUserId,
  },
};
