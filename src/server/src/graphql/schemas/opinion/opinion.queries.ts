import {gql} from 'apollo-server-core';
import {db} from '../../../data';
import {authenticationGuard, expiredAccessTokenError} from '../../../utilities/guard';
import {
  queryGeneralOpinionsForAuthorizedUser,
  queryGeneralOpinionsForUnauthorizedUser,
} from '../../../data/queries/opinion';
import {QueryResult, QueryResultRow} from 'pg';
import {bigintValidator} from '../../../validators/shared';
import {ApolloError} from 'apollo-server-fastify';

export const opinionQueryTypeDefinitions = gql`
  type Query {
    getGeneralOpinions(edgeId: String): [Opinion!]
  }
`;
// We can show users only that opinions which he can react to which are:
// (OpinionsView.General)
// 1. Not his own (based on user_opinions.user_id)
// 2. He has not reacted to yet (based on user_opinions.id NOT IN FIND user_reactions.opinion_id WHERE user_reactions.user_id = AUTHED USER ID)
// (OpinionsView.Individual)
// 1. All opinions even to which he reacted to (fetch opinions where user_opinions.user_id = DESIRED USER ID)
const getGeneralOpinions = async (
  _: unknown,
  {edgeId}: {edgeId: string},
  {accessToken}: {accessToken: string},
): Promise<Array<QueryResultRow> | ApolloError | null> => {
  const {error} = bigintValidator.validate(edgeId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);
  // This fixes issues for authed users with expired token when they might receive opinions returned by queryGeneralOpinionsForUnauthorizedUser
  if (expiredAccessTokenError(authenticationError)) return authenticationError;

  let result: QueryResult;

  if (tokenData) {
    result = await db.query(queryGeneralOpinionsForAuthorizedUser(tokenData.userId, edgeId));
  } else {
    result = await db.query(queryGeneralOpinionsForUnauthorizedUser());
  }

  if (!result.rowCount) return null;

  return result.rows;
};

export const opinionQueryResolvers = {
  Query: {
    getGeneralOpinions,
  },
};
