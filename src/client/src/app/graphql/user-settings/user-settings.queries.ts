import {gql} from 'apollo-angular';

export const GET_USER_SETTINGS = gql`
  query {
    userSettings {
      follow
      view_following
      message
      view_opinions
      view_reactions
      view_favorites
    }
  }
`;
