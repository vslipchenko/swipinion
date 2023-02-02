import {gql} from 'apollo-server-core';
import {db} from '../../../data';
import {authenticationGuard} from '../../../utilities/guard';
import {
  queryGeneralOpinionsForAuthorizedUser,
  queryGeneralOpinionsForUnauthorizedUser,
} from '../../../data/queries/opinion';
import {QueryResult} from 'pg';

export const opinionQueryTypeDefinitions = gql`
  type Query {
    getGeneralOpinions: [Opinion!]
  }
`;
// We can show users only that opinions which he can react to which are:
// (OpinionsView.General)
// 1. Not his own (based on user_opinions.user_id)
// 2. He has not reacted to yet (based on user_opinions.id NOT IN FIND user_reactions.opinion_id WHERE user_reactions.user_id = AUTHED USER ID)
// (OpinionsView.Individual)
// 1. All opinions even to which he reacted to (fetch opinions where user_opinions.user_id = DESIRED USER ID)
export const getGeneralOpinions = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<QueryResult | null> => {
  const {tokenData} = authenticationGuard(accessToken);

  if (tokenData) {
    return await db.query(queryGeneralOpinionsForAuthorizedUser(tokenData.userId));
  }

  return await db.query(queryGeneralOpinionsForUnauthorizedUser());
};

export const opinionQueryResolvers = {
  Query: {
    getGeneralOpinions: getGeneralOpinions,
  },
};
