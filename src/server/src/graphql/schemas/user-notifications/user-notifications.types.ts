import {gql} from 'apollo-server-core';

export const userNotificationsTypes = gql`
  type Notification {
    id: ID
    type: Int
    username: String
    thumbnail: String
    follower_record_id: ID
    read: Boolean
    created_at: Float
  }
`;
