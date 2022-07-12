import {gql} from 'apollo-server-core';

export const userSettingsTypes = gql`
  type UserSettings {
    follow: Int!
    view_following: Int!
    message: Int!
    view_opinions: Int!
    view_reactions: Int!
    view_favorites: Int!
  }
`;
