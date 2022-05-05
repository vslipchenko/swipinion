import {gql} from 'apollo-server-core';

export const authenticationInputs = gql`
  input SignIn {
    email: String!
    password: String!
  }
`;
