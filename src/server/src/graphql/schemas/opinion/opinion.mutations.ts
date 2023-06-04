import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {ReactToOpinion} from '../../../typings/opinion/opinion.interfaces';
import {reactToOpinionValidator} from '../../../validators/opinion';
import {queryAddOpinionToFavorites, queryReactToOpinion} from '../../../data/queries/opinion';
import {bigintValidator} from '../../../validators/shared';

export const opinionMutationTypeDefinitions = gql`
  type Mutation {
    reactToOpinion(input: ReactToOpinion!): Success
    addOpinionToFavorites(opinionId: String!): Success
  }
`;

const reactToOpinion = async (
  _: unknown,
  {input}: {input: ReactToOpinion},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = reactToOpinionValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryReactToOpinion({...input, userId: tokenData.userId}));

  return {success: Boolean(result.rowCount)};
};

const addOpinionToFavorites = async (
  _: unknown,
  {opinionId}: {opinionId: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(opinionId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryAddOpinionToFavorites(opinionId, tokenData.userId));

  return {success: Boolean(result.rowCount)};
};

export const opinionMutationResolvers = {
  Mutation: {
    reactToOpinion,
    addOpinionToFavorites,
  },
};
