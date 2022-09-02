import {ApolloError, gql} from 'apollo-server-core';
import {db} from '../../../data';
import {queryUserSettings} from '../../../data/queries/user-settings';
import {authenticationGuard} from '../../../utilities/guard';
import {bigintValidator} from '../../../validators/shared';
import {AccessTokenData} from '../../../typings/authentication/authentication.interfaces';
import {QueryResultRow} from 'pg';

export const userSettingsQueryTypeDefinitions = gql`
  type Query {
    userSettings(userId: String): UserSettings
  }
`;

const userSettings = async (
  _1: unknown,
  {userId}: {userId: string},
  {accessToken}: {accessToken: string},
): Promise<QueryResultRow | ApolloError | null> => {
  let tokenData = {} as AccessTokenData;

  if (userId) {
    const {error} = bigintValidator.validate(userId);

    if (error) return null;
  } else {
    const {error, tokenData: data} = authenticationGuard(accessToken);

    tokenData = data;

    if (error) return error;
  }

  const result = await db.query(queryUserSettings(tokenData.userId ?? userId));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const userSettingsQueryResolvers = {
  Query: {
    userSettings,
  },
};
