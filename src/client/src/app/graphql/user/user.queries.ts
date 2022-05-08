import {gql} from 'apollo-angular';

export const USER_WITH_EMAIL_EXISTS = gql`
  query ($email: String!) {
    userWithEmailExists(email: $email) {
      exists
    }
  }
`;

export const USER_WITH_USERNAME_EXISTS = gql`
  query ($username: String!) {
    userWithUsernameExists(username: $username) {
      exists
    }
  }
`;

export const USER_WITH_RECOVERY_CODE_EXISTS = gql`
  query ($input: UserCode!) {
    userWithRecoveryCodeExists(input: $input) {
      exists
    }
  }
`;
