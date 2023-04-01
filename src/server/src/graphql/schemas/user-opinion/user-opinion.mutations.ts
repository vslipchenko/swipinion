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
import {CreateOpinion} from '../../../typings/user-opinion/user-opinion.interfaces';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {bigintValidator} from '../../../validators/shared';
import {OpinionType} from '../../../typings/opinion/opinion.enums';

export const userOpinionMutationTypeDefinitions = gql`
  type Mutation {
    createOpinion(input: CreateOpinion!): CreateOpinionResult
    deleteOpinion(opinionId: String!): Success
  }
`;

const createOpinion = async (
  _: unknown,
  {input}: {input: CreateOpinion},
  {accessToken}: {accessToken: string},
): Promise<{id: string; type: OpinionType} | ApolloError | null> => {
  if (!input.fileUrl && !input.description) return null; // Check whether any content provided

  const {error} = createOpinionValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  let type = OpinionType.Text;

  switch (true) {
    case Boolean(input.description && input.fileUrl):
      type = OpinionType.TextImage;
      break;
    case Boolean(input.fileUrl):
      type = OpinionType.Image;
      break;
    // else assume Boolean(input.description) is true and opinionType = OpinionType.Text
  }

  let query;

  if (input.tags.length) {
    query = queryOpinionCreateWithTags({...input, type, userId: tokenData.userId});

    query.text = query.text.replace('{{values}}', concatenateTagValues(input.tags));
  } else {
    query = queryOpinionCreate({...input, type, userId: tokenData.userId});
  }

  const result = await db.query(query);

  if (!result.rowCount) return null;

  return {id: result.rows[0].id, type};
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
