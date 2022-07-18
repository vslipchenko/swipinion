import {gql} from 'apollo-server-core';

export const userNotificationsTypes = gql`
  type Notification {
    type: Int
    involved_user_id: String
    created_at: String
  }
`;