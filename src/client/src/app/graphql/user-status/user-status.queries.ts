import {gql} from 'apollo-angular';

export const CHECK_USER_STATUS = gql`
  query ($checkMessage: Boolean!) {
    checkUserStatus(checkMessage: $checkMessage) {
      unreadMessages {
        id
        sender_id
      }
      unreadNotification
    }
  }
`;
