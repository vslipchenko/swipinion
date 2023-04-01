import {gql} from 'apollo-server-core';

export const userTypes = gql`
  type AuthenticatedUserEssentials {
    id: ID
    username: String
    thumbnail: String
    bio: String
    language: String
  }
`;
