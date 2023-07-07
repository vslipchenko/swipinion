import {gql} from 'apollo-server-core';

export const userFavoritesInputs = gql`
  input GetFavorites {
    username: String!
    edgeId: String
  }
`;
