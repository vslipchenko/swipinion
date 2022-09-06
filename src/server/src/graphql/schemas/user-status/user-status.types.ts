import {gql} from 'apollo-server-core';

export const userStatusTypes = gql`
  type UserStatus {
    unreadMessages: [UnreadMessage]!
    unreadNotification: String
  }

  type UnreadMessage {
    id: String
    sender_id: String
  }
`;
