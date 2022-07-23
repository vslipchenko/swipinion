import {gql} from 'apollo-server-core';

export const userMessagesInputs = gql`
  input SendUserMessage {
    receiverId: String!
    body: String!
  }
`;
