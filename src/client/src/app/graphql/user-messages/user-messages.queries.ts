import {gql} from 'apollo-angular';

export const FETCH_USER_MESSAGES = gql`
  query ($edgeId: String) {
    fetchUserMessages(edgeId: $edgeId) {
      id
      user_id_1
      user_id_2
      sender_id
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
      user_id_1
      user_id_2
      sender_id
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
