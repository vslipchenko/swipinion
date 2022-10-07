import {gql} from 'apollo-angular';

export const SEND_USER_MESSAGE = gql`
  mutation ($input: SendUserMessage!) {
    sendUserMessage(input: $input) {
      success
      results {
        interlocutorMessages {
          id
          sender_id # this can be dropped from a query
          recipient_id # this can be dropped from a query
          body
          read # this can be dropped from a query
          created_at
        }
        sentMessage {
          id
          sender_id # this can be dropped from a query
          recipient_id # this can be dropped from a query
          body # this can be dropped from a query
          read # this can be dropped from a query as it might be false as it was just inserted
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
