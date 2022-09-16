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

  type Conversation {
    id: String
    sender_id: String
    recipient_id: String
    body: String
    read: Boolean
    created_at: Float
  }
`;
