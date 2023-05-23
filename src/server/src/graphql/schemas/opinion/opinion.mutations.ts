import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {CommentOpinion} from '../../../typings/opinion/opinion.interfaces';
import {commentOpinionValidator} from '../../../validators/opinion';
import {queryCommentOpinion} from '../../../data/queries/opinion';

export const opinionMutationTypeDefinitions = gql`
  type Mutation {
    commentOpinion(input: CommentOpinion!): Success
  }
`;

const commentOpinion = async (
  _: unknown,
  {input}: {input: CommentOpinion},
  {accessToken}: {accessToken: string},
): Promise<SuccessResponse | ApolloError | null> => {
  const {error} = commentOpinionValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryCommentOpinion({...input, userId: tokenData.userId}));

  return {success: Boolean(result.rowCount)};
};

export const opinionMutationResolvers = {
  Mutation: {
    commentOpinion,
  },
};
