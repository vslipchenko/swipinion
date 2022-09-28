import {gql} from 'apollo-angular';

export const FETCH_USER_MESSAGES = gql`
  query ($edgeId: String) {
    fetchUserMessages(edgeId: $edgeId) {
      id
      sender_id
      recipient_id
      username
      thumbnail
      teaser
      read
      created_at
    }
  }
`;

export const FETCH_NEW_USER_MESSAGES = gql`
  query ($input: [String!]!) {
    fetchNewUserMessages(input: $input) {
      id
      sender_id
      recipient_id
      username
      thumbnail
      teaser
      read
      created_at
    }
  }
`;

export const FETCH_USER_CONVERSATION = gql`
  query ($input: FetchUserConversation) {
    fetchUserConversation(input: $input) {
      id
      sender_id
      recipient_id
      body
      read
      created_at
    }
  }
`;

export const CHECK_CONVERSATION_MESSAGE_STATUS = gql`
  query ($input: String!) {
    checkConversationMessageStatus(input: $input)
  }
`;
