import {gql} from 'apollo-server-core';

export const opinionInputs = gql`
  input CreateOpinion {
    type: Int!
    fileUrl: String
    title: String
    description: String
    tags: [String]!
  }

  input GetOpinions {
    username: String!
    offset: Float!
  }
`;
