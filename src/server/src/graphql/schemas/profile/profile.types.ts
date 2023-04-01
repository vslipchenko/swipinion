import {gql} from 'apollo-server-core';

export const profileTypes = gql`
  type UserProfile {
    id: ID
    follower_id: ID
    pending: Boolean
    bio: String
    thumbnail: String
  }
`;
