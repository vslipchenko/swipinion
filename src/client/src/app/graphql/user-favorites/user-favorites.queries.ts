import {gql} from 'apollo-angular';

export const GET_USER_FAVORITES = gql`
  query ($edgeId: String) {
    getUserFavorites(edgeId: $edgeId) {
      id
      user_id
      username
      thumbnail
      type
      file_url
      body
      agreed
      disagreed
      comments
      tags
    }
  }
`;
