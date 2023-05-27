import {gql} from 'apollo-server-core';

export const opinionInputs = gql`
  input ReactToOpinion {
    opinionId: String!
    reaction: Int!
    comment: String
  }
`;
