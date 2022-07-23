import {ApolloError, gql} from 'apollo-server-core';
import {createOpinionValidator} from '../../../validators/user-opinion';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {
  concatenateTagValues,
  queryOpinionCreate,
  queryOpinionCreateWithTags,
  queryOpinionDelete,
} from '../../../data/queries/user-opinion';
import {CreateOpinion} from '../../../typings/opinion/opinion.interfaces';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {bigintValidator} from '../../../validators/shared';

export const userOpinionMutationTypeDefinitions = gql`
  type Mutation {
    createOpinion(input: CreateOpinion!): ID
    deleteOpinion(opinionId: String!): Success
  }
`;

const createOpinion = async (
  _: unknown,
  {input}: {input: CreateOpinion},
  {accessToken}: {accessToken: string},
): Promise<string | ApolloError | null> => {
  const {error} = createOpinionValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  let query;

  if (input.tags.length) {
    query = queryOpinionCreateWithTags({...input, userId: tokenData.userId});

    query.text = query.text.replace('{{values}}', concatenateTagValues(input.tags));
  } else {
    query = queryOpinionCreate({...input, userId: tokenData.userId});
  }

  const result = await db.query<{id: string}>(query);

  if (!result.rowCount) return null;

  return result.rows[0].id;
};

const deleteOpinion = async (
  _: unknown,
  {opinionId}: {opinionId: string},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = bigintValidator.validate(opinionId);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryOpinionDelete(tokenData.userId, opinionId));

  return {success: Boolean(result.rowCount)};
};

export const userOpinionMutationResolvers = {
  Mutation: {
    createOpinion,
    deleteOpinion,
  },
};
