import {gql} from 'apollo-server-core';

export const userStatusTypes = gql`
  type UserStatus {
    unreadNotification: Boolean!
    unreadMessage: Boolean!
  }
`;
