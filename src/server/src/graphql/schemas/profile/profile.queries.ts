import {gql} from 'apollo-server-core';
import {emailValidator} from '../../../validators/shared';
import {db} from '../../../data';
import {queryUserCheckExistenceByEmail} from '../../../data/queries/user';

export const profileQueryTypeDefinitions = gql`
  type Query {
    profile(email: String!): Exists
  }
`;

const profile = async (_: unknown, {email}: {email: string}): Promise<{exists: boolean} | null> => {
  const {error} = emailValidator.validate(email);

  if (error) return null;

  const result = await db.query(queryUserCheckExistenceByEmail(email));

  return {exists: Boolean(result.rowCount)};
};

export const profileQueryResolvers = {
  Query: {
    profile,
  },
};
