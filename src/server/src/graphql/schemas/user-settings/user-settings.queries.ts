import {ApolloError, gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryUserSettings} from '../../../data/queries/user-settings';
import {authenticationGuard} from '../../../utilities/guard';
import {bigintValidator} from '../../../validators/shared';
import {QueryResultRow} from 'pg';

export const userSettingsQueryTypeDefinitions = gql`
  type Query {
    userSettings(userId: String): UserSettings
  }
`;

const userSettings = async (
  _: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  if (userId) {
    const {error} = bigintValidator.validate(userId);

    if (error) return null;
  } else {
    const {error, tokenData} = authenticationGuard(accessToken);

    if (error) return error;

    userId = tokenData.userId;
  }

  const result = await db.query(queryUserSettings(userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userSettingsQueryResolvers = {
  Query: {
    userSettings,
  },
};
