import {ApolloError, gql} from 'apollo-server-core';
import {updateUserSettingsValidator} from '../../../validators/user-settings';
import {UserSettings} from '../../../typings/user-settings/user-settings.interfaces';
import {authenticationGuard} from '../../../utilities/guard';
import {db} from '../../../data';
import {queryUpdateUserSettings} from '../../../data/queries/user-settings';

export const userSettingsMutationTypeDefinitions = gql`
  type Mutation {
    updateUserSettings(input: UpdateUserSettings!): Success
  }
`;

const updateUserSettings = async (
  _: unknown,
  {input}: {input: UserSettings},
  {accessToken}: {accessToken: string},
): Promise<{success: boolean} | ApolloError | null> => {
  const {error} = updateUserSettingsValidator.validate(input);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUpdateUserSettings(tokenData.userId, input));

  return {success: Boolean(result.rowCount)};
};

export const userSettingsMutationResolvers = {
  Mutation: {
    updateUserSettings,
  },
};
