import {ApolloError, gql} from 'apollo-server-core';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {SuccessResponse} from '../../../typings/response/response.interfaces';
import {ReactToOpinion} from '../../../typings/opinion/opinion.interfaces';
import {reactToOpinionValidator} from '../../../validators/opinion';
import {queryReactToOpinion} from '../../../data/queries/opinion';

export const opinionMutationTypeDefinitions = gql`
  type Mutation {
    reactToOpinion(input: ReactToOpinion!): Success
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

export const opinionMutationResolvers = {
  Mutation: {
    reactToOpinion: reactToOpinion,
  },
};
