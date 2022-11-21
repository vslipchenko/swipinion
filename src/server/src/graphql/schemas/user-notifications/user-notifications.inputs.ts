import {gql} from 'apollo-server-core';

export const userNotificationsInputs = gql`
  input UserNotificationsInput {
    edgeId: String
    markRead: Boolean!
  }
`;
