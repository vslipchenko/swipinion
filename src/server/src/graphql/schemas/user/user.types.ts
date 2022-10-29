import {gql} from 'apollo-server-core';

export const userTypes = gql`
  type AuthenticatedUserEssentials {
    id: String
    username: String
    thumbnail: String
    language: String
  }
`;
