import {gql} from 'apollo-server-core';

export const userInputs = gql`
  input CreateUser {
    username: String!
    email: String!
    password: String!
    language: Language!
  }

  input UserCode {
    email: String!
    code: String!
  }

  input RecoverPassword {
    email: String!
    language: Language!
  }

  input ResetPassword {
    password: String!
    key: String!
  }
`;
