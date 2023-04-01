import {gql} from 'apollo-server-core';

export const userOpinionTypes = gql`
  type UserOpinion {
    id: ID
    type: Int
    file_url: String
    description: String
    tags: [String]!
  }

  type CreateOpinionResult {
    id: ID
    type: Int
  }
`;
