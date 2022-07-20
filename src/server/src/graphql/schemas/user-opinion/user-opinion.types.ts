import {gql} from 'apollo-server-core';

export const userOpinionTypes = gql`
  type Opinion {
    id: ID
    type: Int
    file_url: String
    title: String
    description: String
    tags: [String]!
  }
`;
