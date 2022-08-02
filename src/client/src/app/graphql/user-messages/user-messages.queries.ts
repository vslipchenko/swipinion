import {gql} from 'apollo-angular';

export const FETCH_USER_MESSAGES = gql`
  query ($startDate: String) {
    fetchUserMessages(startDate: $startDate) {
      sender_id
      username
      thumbnail
      body
      created_at
    }
  }
`;
