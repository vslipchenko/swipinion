import {gql} from 'apollo-angular';

export const CHECK_USER_STATUS = gql`
  query ($input: UserStatusCheck!) {
    checkUserStatus(input: $input) {
      unreadMessageTimestamp
      unreadNotificationTimestamp
    }
  }
`;
