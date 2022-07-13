import {gql} from 'apollo-angular';

export const UPDATE_USER_SETTINGS = gql`
  mutation ($input: UpdateUserSettings!) {
    updateUserSettings(input: $input) {
      success
    }
  }
`;
