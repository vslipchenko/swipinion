import {gql} from 'apollo-angular';

export const SEND_USER_MESSAGE = gql`
  mutation ($input: SendUserMessage!) {
    sendUserMessage(input: $input) {
      success
      results {
        interlocutorMessages {
          id
          body
          created_at
        }
        sentMessage {
          id
          created_at
        }
      }
    }
  }
`;

export const SEND_USER_SAVED_MESSAGE = gql`
  mutation ($input: String!) {
    sendUserSavedMessage(input: $input) {
      id
      created_at
    }
  }
`;
