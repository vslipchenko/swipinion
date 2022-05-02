import {gql} from 'apollo-server-core';
import {queryUserCheckExistenceByEmail, queryUserCheckExistenceByUsername} from '../../../data/queries/user';
import {db} from '../../../data';
import {emailValidator, usernameValidator} from '../../../validators/shared';

export const userQueryTypeDefinitions = gql`
  type Query {
    userWithEmailExists(email: String!): Exists
    userWithUsernameExists(username: String!): Exists
  }
`;

const userWithEmailExists = async (_: unknown, {email}: {email: string}): Promise<{exists: boolean} | null> => {
  const {error} = emailValidator.validate(email);

  if (error) return null;

  const result = await db.query(queryUserCheckExistenceByEmail(email));

  return {exists: Boolean(result.rowCount)};
};

const userWithUsernameExists = async (
  _: unknown,
  {username}: {username: string},
): Promise<{exists: boolean} | null> => {
  const {error} = usernameValidator.validate(username);

  if (error) return null;

  const result = await db.query(queryUserCheckExistenceByUsername(username));

  return {exists: Boolean(result.rowCount)};
};

export const userQueryResolvers = {
  Query: {
    userWithEmailExists,
    userWithUsernameExists,
  },
};
