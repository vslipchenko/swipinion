import {gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryOpinionsByUsername} from '../../../data/queries/user-opinion';
import {getOpinionsByUsernameValidator} from '../../../validators/user-opinion';
import {authenticationGuard} from '../../../utilities/guard';
import {compact} from 'lodash';
import {USER_OPINION_FETCH_LIMIT} from '../../../constants/opinions';

export const userOpinionQueryTypeDefinitions = gql`
  type Query {
    getOpinionsByUsername(input: GetOpinions!): [UserOpinion!]
  }
`;

const getOpinionsByUsername = async (
  _: unknown,
  {input}: {input: {username: string; edgeId: string}},
  {accessToken}: {accessToken: string},
): Promise<{exists: boolean} | null | Array<unknown>> => {
  const {error} = getOpinionsByUsernameValidator.validate(input);

  if (error) return null;

  const {tokenData} = authenticationGuard(accessToken);
  // Compose array of truthy values
  const values = compact([input.username, USER_OPINION_FETCH_LIMIT, input.edgeId, tokenData?.userId]);

  const queryPayload = {
    parametersPlaceholderMap: {
      // Assign proper placeholder indexes
      edgeId: input.edgeId ? '$3' : null,
      followerId: tokenData?.userId ? (input.edgeId ? '$4' : '$3') : null,
    },
    values,
  };

  const result = await db.query(queryOpinionsByUsername(queryPayload));

  if (!result.rowCount) return null;

  return result.rows;
};

export const userOpinionQueryResolvers = {
  Query: {
    getOpinionsByUsername,
  },
};
