import {gql} from 'apollo-server-core';

export const userNotificationsTypes = gql`
  type Notification {
    id: String
    type: Int
    username: String
    thumbnail: String
    follower_record_id: String
    read: Boolean
    created_at: Float
  }
`;
