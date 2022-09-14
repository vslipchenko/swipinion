import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    id: String
    user_id_1: String
    user_id_2: String
    sender_id: String
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
