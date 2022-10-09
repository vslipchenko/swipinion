import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    id: String
    sender_id: String
    recipient_id: String
    username: String
    thumbnail: String
    teaser: String
    read: Boolean
    created_at: Float
  }

  type SavedMessage {
    id: String
    body: String
    created_at: Float
  }

  type ConversationMessage {
    id: String
    sender_id: String
    recipient_id: String
    body: String
    read: Boolean
    created_at: Float
  }

  type InterlocutorConversationMessage {
    id: String
    body: String
    created_at: Float
  }

  type SentConversationMessage {
    id: String
    created_at: Float
  }

  type SendUserMessageTransactionResults {
    interlocutorMessages: [InterlocutorConversationMessage]
    sentMessage: SentConversationMessage
  }

  type SendUserMessageResult {
    success: Boolean!
    results: SendUserMessageTransactionResults!
  }

  type SendUserSavedMessage {
    id: String!
    created_at: Float!
  }
`;
