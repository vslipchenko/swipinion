import {gql} from 'apollo-angular';

export const GET_USER_SETTINGS = gql`
  query ($userId: String) {
    userSettings(userId: $userId) {
      follow
      message
      view_followers
      view_following
      view_opinions
      view_reactions
      view_favorites
    }
  }
`;
