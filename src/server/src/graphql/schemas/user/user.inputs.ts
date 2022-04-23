import {gql} from 'apollo-server-core';

export const userInputs = gql`
  input CreateUser {
    email: String!
    password: String!
    language: Language!
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
