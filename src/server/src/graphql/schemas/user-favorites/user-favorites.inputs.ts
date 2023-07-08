import {gql} from 'apollo-server-core';

export const userFavoritesInputs = gql`
  input GetUserFavorites {
    userId: String!
    edgeId: String
  }
`;
