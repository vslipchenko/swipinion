import {gql} from 'apollo-angular';

export const GET_USER_NOTIFICATIONS = gql`
  query ($offset: Float!) {
    userNotifications(offset: $offset) {
      id
      type
      username
      thumbnail
      follower_record_id
      created_at
    }
  }
`;
