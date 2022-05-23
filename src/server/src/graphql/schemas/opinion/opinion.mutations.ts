import {ApolloError, gql} from 'apollo-server-core';
import {createOpinionValidator} from '../../../validators/opinion';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {concatenateTagValues, queryOpinionCreate} from '../../../data/queries/opinion';
import {CreateOpinion} from '../../../typings/opinion/opinion.interfaces';

export const opinionMutationTypeDefinitions = gql`
  type Mutation {
    createOpinion(input: CreateOpinion!): ID
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

  const query = queryOpinionCreate({...input, userId: tokenData.userId});

  query.text = query.text.replace('{{values}}', concatenateTagValues(input.tags));

  const result = await db.query<{id: string}>(query);

  if (!result.rowCount) return null;

  return result.rows[0].id;
};

export const opinionMutationResolvers = {
  Mutation: {
    createOpinion,
  },
};
