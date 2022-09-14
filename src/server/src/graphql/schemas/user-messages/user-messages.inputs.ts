import {gql} from 'apollo-server-core';

export const userMessagesInputs = gql`
  input SendUserMessage {
    recipientId: String!
    body: String!
  }

  input FetchUserConversation {
    user_id_1: String!
    user_id_2: String!
    edgeId: String
    markRead: Boolean!
  }
`;
