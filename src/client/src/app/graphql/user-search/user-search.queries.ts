import {gql} from 'apollo-angular';

export const SEARCH_USER = gql`
  query ($username: String) {
    userSearch(username: $username) {
      id
      username
      thumbnail
    }
  }
`;
