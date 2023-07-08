import {gql} from 'apollo-server-core';

export const userOpinionInputs = gql`
  input CreateOpinion {
    fileUrl: String
    body: String
    tags: [String]!
  }

  input GetOpinions {
    userId: String!
    edgeId: String
  }
`;
