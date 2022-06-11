import {gql} from 'apollo-server-core';

export const opinionTypes = gql`
  type Opinion {
    id: ID
    type: Int
    file_url: String
    title: String
    description: String
  }
`;
