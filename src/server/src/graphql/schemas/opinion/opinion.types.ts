import {gql} from 'apollo-server-core';

export const opinionTypes = gql`
  type Opinion {
    id: ID
    user_id: ID
    username: String
    thumbnail: String
    type: Int
    file_url: String
    body: String
    agreed: Float
    disagreed: Float
    comments: Float
    tags: [String]!
  }
`;
