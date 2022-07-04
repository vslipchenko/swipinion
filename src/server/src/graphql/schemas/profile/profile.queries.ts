import {gql} from 'apollo-server-core';
import {usernameValidator} from '../../../validators/shared';
import {db} from '../../../data';
import {queryUserProfileData} from '../../../data/queries/user';
import {authenticationGuard} from '../../../utilities/guard';

export const profileQueryTypeDefinitions = gql`
  type Query {
    userProfile(username: String!): UserProfile
  }
`;

const userProfile = async (
  _: unknown,
  {username}: {username: string},
  {accessToken}: {accessToken: string},
): Promise<{id: string; follower_id: string; bio: string; thumbnail?: string} | null> => {
  const {error} = usernameValidator.validate(username);

  if (error) return null;

  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  const result = await db.query<{id: string; follower_id: string; bio: string; thumbnail?: string}>(
    queryUserProfileData(username, authenticationError ? null : tokenData.userId),
  );

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const profileQueryResolvers = {
  Query: {
    userProfile,
  },
};
