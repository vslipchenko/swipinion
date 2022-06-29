import {gql} from 'apollo-server-core';
import {usernameValidator} from '../../../validators/shared';
import {db} from '../../../data';
import {queryUserProfileData} from '../../../data/queries/user';

export const profileQueryTypeDefinitions = gql`
  type Query {
    userProfile(username: String!): UserProfile
  }
`;

const userProfile = async (
  _: unknown,
  {username}: {username: string},
): Promise<{bio: string; thumbnail?: string} | null> => {
  const {error} = usernameValidator.validate(username);

  if (error) return null;

  const result = await db.query<{bio: string; thumbnail?: string}>(queryUserProfileData(username));

  if (!result.rowCount) return null;

  return result.rows[0];
};

export const profileQueryResolvers = {
  Query: {
    userProfile,
  },
};
