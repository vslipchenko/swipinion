import {gql} from 'apollo-server-core';

export const opinionInputs = gql`
  input CommentOpinion {
    opinionId: String!
    reaction: Int!
    comment: String!
  }
`;
