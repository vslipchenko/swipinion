import {gql} from 'apollo-angular';

export const GET_USER_NOTIFICATIONS = gql`
  query ($offset: Float!) {
    userNotifications(offset: $offset) {
      type
      username
      thumbnail
      read
      created_at
    }
  }
`;
