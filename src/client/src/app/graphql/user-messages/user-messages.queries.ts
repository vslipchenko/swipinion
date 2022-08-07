import {gql} from 'apollo-angular';

export const FETCH_USER_MESSAGES = gql`
  query ($startDate: String) {
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
