import {ApolloError, gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryUserSettings} from '../../../data/queries/user-settings';
import {authenticationGuard} from '../../../utilities/guard';
import {UserSettings} from '../../../typings/user-settings/user-settings.interfaces';

export const userSettingsQueryTypeDefinitions = gql`
  type Query {
    userSettings: UserSettings
  }
`;

const userSettings = async (
  _1: unknown,
  _2: unknown,
  {accessToken}: {accessToken: string},
): Promise<UserSettings | ApolloError | null> => {
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query<UserSettings>(queryUserSettings(tokenData.userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userSettingsQueryResolvers = {
  Query: {
    userSettings,
  },
};
