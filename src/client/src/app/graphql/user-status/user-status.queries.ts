import {gql} from 'apollo-angular';

export const CHECK_USER_STATUS = gql`
  query {
    checkUserStatus {
      unreadMessage
      unreadNotification
    }
  }
`;
