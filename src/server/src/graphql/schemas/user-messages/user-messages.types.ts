import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    id: ID
    sender_id: ID
    recipient_id: ID
    username: String
    thumbnail: String
    teaser: String
    read: Boolean
    created_at: Float
  }

  type SavedMessage {
    id: ID
    body: String
    created_at: Float
  }

  type ConversationMessage {
    id: ID
    sender_id: ID
    recipient_id: ID
    body: String
    read: Boolean
    created_at: Float
  }

  type InterlocutorConversationMessage {
    id: ID
    body: String
    created_at: Float
  }

  type SentConversationMessage {
    id: ID
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
    id: ID!
    created_at: Float!
  }
`;
