import {gql} from 'apollo-server-core';

export const profileTypes = gql`
  type UserProfile {
    id: String
    follower_id: String
    pending: Boolean
    bio: String
    thumbnail: String
  }
`;
