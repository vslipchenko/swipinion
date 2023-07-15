import {gql} from 'apollo-server-core';

export const userOpinionTypes = gql`
  type UserOpinion {
    id: ID
    type: Int!
    file_url: String
    body: String
    tags: [String]!
    reaction: Int
    commented: Boolean!
    agreed: Float!
    disagreed: Float!
    comments: Float!
  }

  type CreateOpinionResult {
    id: ID
    type: Int
  }
`;
