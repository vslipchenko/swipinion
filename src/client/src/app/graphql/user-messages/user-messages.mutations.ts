import {gql} from 'apollo-angular';

export const SEND_USER_MESSAGE = gql`
  mutation ($input: SendUserMessage!) {
    sendUserMessage(input: $input) {
      success
    }
  }
`;
