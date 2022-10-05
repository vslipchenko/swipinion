import {gql} from 'apollo-angular';

export const SEND_USER_MESSAGE = gql`
  mutation ($input: SendUserMessage!) {
    sendUserMessage(input: $input) {
      success
      results {
        interlocutorMessages {
          id
          sender_id
          recipient_id
          body
          read
          created_at
        }
        sentMessage {
          id
          sender_id
          recipient_id
          body
          read
          created_at
        }
      }
    }
  }
`;
