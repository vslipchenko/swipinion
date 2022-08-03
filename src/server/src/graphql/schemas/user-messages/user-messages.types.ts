import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    id: String
    sender_id: String
    username: String
    thumbnail: String
    body: String
    read: Boolean
    created_at: Float
  }
`;
