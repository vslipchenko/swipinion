import {gql} from 'apollo-angular';

export const GET_USER_NOTIFICATIONS = gql`
  query ($input: UserNotificationsInput!) {
    userNotifications(input: $input) {
      id
      type
      username
      thumbnail
      follower_record_id
      created_at
    }
  }
`;
