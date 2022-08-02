import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    sender_id: String
    username: String
    thumbnail: String
    body: String
    created_at: String
  }
`;