import {gql} from 'apollo-server-core';

export const userTypes = gql`
  type UserEssentials {
    id: String
    username: String
    thumbnail: String
    language: String
  }
`;