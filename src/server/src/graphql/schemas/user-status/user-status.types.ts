import {gql} from 'apollo-server-core';

export const userStatusTypes = gql`
  type UserStatus {
    unreadNotificationTimestamp: Float
    unreadMessageTimestamp: Float
  }
`;
