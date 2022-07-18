import {gql} from 'apollo-server-core';

export const userNotificationsTypes = gql`
  type Notification {
    type: Int
    username: String
    thumbnail: String
    read: Boolean
    created_at: Float
  }
`;
