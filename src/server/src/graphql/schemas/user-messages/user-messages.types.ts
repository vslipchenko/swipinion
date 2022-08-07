import {gql} from 'apollo-server-core';

export const userMessagesTypes = gql`
  type Message {
    id: String
    user_id_1: String
    user_id_2: String
    username: String
    thumbnail: String
    teaser: String
    read: Boolean
    created_at: Float
  }
`;
