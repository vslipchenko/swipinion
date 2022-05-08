import {gql} from 'apollo-server-core';
import {
  queryUserCheckExistenceByEmail,
  queryUserCheckExistenceByUsername,
  queryUserWithRecoveryCodeByEmail,
} from '../../../data/queries/user';
import {db} from '../../../data';
import {emailValidator, usernameValidator} from '../../../validators/shared';
import {userCodeValidator} from '../../../validators/user';

export const userQueryTypeDefinitions = gql`
  type Query {
    userWithEmailExists(email: String!): Exists
    userWithUsernameExists(username: String!): Exists
    userWithRecoveryCodeExists(input: UserCode!): Exists
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

const userWithRecoveryCodeExists = async (
  _: unknown,
  {input}: {input: {email: string; code: string}},
): Promise<{exists: boolean} | null> => {
  const {error} = userCodeValidator.validate(input);

  if (error) return null;

  const result = await db.query(queryUserWithRecoveryCodeByEmail(input.email, input.code.toUpperCase()));

  return {exists: Boolean(result.rowCount)};
};

export const userQueryResolvers = {
  Query: {
    userWithEmailExists,
    userWithUsernameExists,
    userWithRecoveryCodeExists,
  },
};
