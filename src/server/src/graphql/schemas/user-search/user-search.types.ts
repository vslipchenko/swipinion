import {gql} from 'apollo-server-core';

export const userSearchTypes = gql`
  type UserEssentials {
    id: String
    username: String
    thumbnail: String
  }
`;
