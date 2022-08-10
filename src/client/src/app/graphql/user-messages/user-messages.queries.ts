import {gql} from 'apollo-angular';

export const FETCH_USER_MESSAGES = gql`
  query ($startDate: Float) {
    fetchUserMessages(startDate: $startDate) {
      id
      user_id_1
      user_id_2
      username
      thumbnail
      teaser
      read
      created_at
    }
  }
`;

export const FETCH_USER_CHAT = gql`
  query ($input: FetchUserChat) {
    fetchUserChat(input: $input) {
      id
      body
      created_at
    }
  }
`;
