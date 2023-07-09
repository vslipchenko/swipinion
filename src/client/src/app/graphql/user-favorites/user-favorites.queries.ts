import {gql} from 'apollo-angular';

export const GET_FAVORITES_BY_USER_ID = gql`
  query ($input: GetUserFavorites!) {
    getFavoritesByUserId(input: $input) {
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
