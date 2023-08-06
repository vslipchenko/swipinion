import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {ReactToOpinion} from '../../../typings/opinion/opinion.interfaces';
import {reactToOpinionValidator} from '../../../validators/opinion';
import {
  queryAddOpinionToFavorites,
  queryReactToOpinion,
  queryRemoveOpinionFromFavorites,
} from '../../../data/queries/opinion';
import {bigintValidator} from '../../../validators/shared';
import {PostgresErrorCode} from '../../../typings/postgres/postgres.enums';

export const opinionMutationTypeDefinitions = gql`
  type Mutation {
    reactToOpinion(input: ReactToOpinion!): Success
    addOpinionToFavorites(opinionId: String!): Success
    removeOpinionFromFavorites(opinionId: String!): Success
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

  try {
    await db.query(queryAddOpinionToFavorites(opinionId, tokenData.userId));
    // Assume query completed successfully
    return {success: true};
  } catch (error: any) {
    // TODO this could be dropped when reactive favorite status is introduced
    // Handle duplicate error when trying to add the same opinion to favorites again
    if (error.code === PostgresErrorCode.UniqueViolation) return {success: false};

    return null; // Other error (is not handled on the frontend)
  }
};

const removeOpinionFromFavorites = async (
  _: unknown,
  {opinionId}: {opinionId: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(opinionId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryRemoveOpinionFromFavorites(opinionId, tokenData.userId));

  return {success: Boolean(result.rowCount)};
};

export const opinionMutationResolvers = {
  Mutation: {
    reactToOpinion,
    addOpinionToFavorites,
    removeOpinionFromFavorites,
  },
};
