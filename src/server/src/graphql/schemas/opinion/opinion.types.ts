import {gql} from 'apollo-server-core';

export const opinionTypes = gql`
  type Opinion {
    id: String
    user_id: String
    type: Int
    file_url: String
    title: String
    description: String
    tags: [String]!
  }
`;
