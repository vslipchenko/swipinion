import {gql} from 'apollo-server-core';

export const profileTypes = gql`
  type UserProfile {
    bio: String
    thumbnail: String
  }
`;