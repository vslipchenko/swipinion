import {ApolloError, gql} from 'apollo-server-core';
import {usernameValidator} from '../../../validators/shared';
import {db} from '../../../data';
import {
  queryUserProfileCompleteData,
  queryUserProfileDataById,
  queryUserProfileDataByUsername,
} from '../../../data/queries/user';
import {authenticationGuard} from '../../../utilities/guard';
import {QueryResultRow} from 'pg';

export const profileQueryTypeDefinitions = gql`
  type Query {
    userProfile(username: String): UserProfile
  }
`;

const userProfile = async (
  _: unknown,
  {username}: {username?: string},
  {accessToken}: {accessToken: string},
): Promise<
  | QueryResultRow
  // | {id: string; follower_id: string; pending: boolean; bio: string; thumbnail?: string} // Authed querying someone's profile
  // | {id: string; bio: string; thumbnail?: string} // Querying own profile or unauthed user
  | ApolloError
  | null
> => {
  if (username) {
    // Querying somebody's else profile data
    const {error} = usernameValidator.validate(username);

    if (error) return null;

    const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

    const result = await db.query(
      authenticationError
        ? queryUserProfileDataByUsername(username) // From perspective of unauthed user
        : queryUserProfileCompleteData(username, tokenData.userId), // From perspective of authed user
    );

    if (!result.rowCount) return null;

    return result.rows[0];
  }
  // Querying own profile data
  const {error: authenticationError, tokenData} = authenticationGuard(accessToken);

  if (authenticationError) return authenticationError;

  const result = await db.query(queryUserProfileDataById(tokenData.userId));

  if (!result.rowCount) return null;

  return {
    id: tokenData.userId,
    ...result.rows[0],
  };
};

export const profileQueryResolvers = {
  Query: {
    userProfile,
  },
};
