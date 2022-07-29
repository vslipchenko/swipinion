import {gql} from 'apollo-angular';

export const CHECK_UNREAD_USER_MESSAGE_EXISTS = gql`
  query {
    checkUnreadUserMessageExists {
      exists
    }
  }
`;
