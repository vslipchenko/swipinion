import {gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryOpinionsByUsername} from '../../../data/queries/opinion';
import {getOpinionsByUsernameValidator} from '../../../validators/opinion';

export const opinionQueryTypeDefinitions = gql`
  type Query {
    getOpinionsByUsername(input: GetOpinions!): [Opinion!]
  }
`;

export const getOpinionsByUsername = async (
  _: unknown,
  {input}: {input: {username: string; offset: number}},
): Promise<{exists: boolean} | null | Array<unknown>> => {
  const {error} = getOpinionsByUsernameValidator.validate(input);

  if (error) return null;

  // {
  //   id: number;
  //   type: number;
  //   file_url: string;
  //   title: string;
  //   description: string;
  // }
  const result = await db.query(queryOpinionsByUsername(input.username, input.offset));

  if (!result.rowCount) return null;

  return result.rows;
};

export const opinionQueryResolvers = {
  Query: {
    getOpinionsByUsername,
  },
};
