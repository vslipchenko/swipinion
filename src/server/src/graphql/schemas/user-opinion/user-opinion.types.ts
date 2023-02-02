import {gql} from 'apollo-server-core';

export const userOpinionTypes = gql`
  type UserOpinion {
    id: String
    type: Int
    file_url: String
    title: String
    description: String
    tags: [String]!
  }
`;
