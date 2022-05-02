import {gql} from 'apollo-angular';

export const USER_WITH_EMAIL_EXISTS = gql`
  query ($email: String!) {
    userWithEmailExists(email: $email) {
      exists
    }
  }
`;
