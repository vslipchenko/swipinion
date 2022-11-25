import {gql} from 'apollo-server-core';

export const userStatusInputs = gql`
  input UserStatusCheck {
    checkMessage: Boolean
    checkNotification: Boolean
  }
`;