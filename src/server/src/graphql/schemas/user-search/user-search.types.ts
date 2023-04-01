import {gql} from 'apollo-server-core';

export const userSearchTypes = gql`
  type UserEssentials {
    id: ID
    username: String
    thumbnail: String
  }
`;
