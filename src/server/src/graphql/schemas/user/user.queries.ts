import {ApolloError, gql} from 'apollo-server-core';
import {
  queryUserCheckExistenceByEmail,
  queryUserCheckExistenceByUsername,
  queryUserEssentialsById,
  queryUserWithRecoveryCodeByEmail,
} from '../../../data/queries/user';
import {db} from '../../../data';
import {emailValidator, usernameValidator} from '../../../validators/shared';
import {userCodeValidator} from '../../../validators/user';
import {authenticationGuard} from '../../../utilities/guard';
import {QueryResultRow} from 'pg';

export const userQueryTypeDefinitions = gql`
  type Query {
    userWithEmailExists(email: String!): Exists
    userWithUsernameExists(username: String!): Exists
    userWithRecoveryCodeExists(input: UserCode!): Exists
    userEssentials: AuthenticatedUserEssentials
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

const userEssentials = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUserEssentialsById(tokenData.userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userQueryResolvers = {
  Query: {
    userWithEmailExists,
    userWithUsernameExists,
    userWithRecoveryCodeExists,
    userEssentials,
  },
};
