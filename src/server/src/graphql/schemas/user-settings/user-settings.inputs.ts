import {gql} from 'apollo-server-core';

export const userSettingsInputs = gql`
  input UpdateUserSettings {
    follow: Int!
    view_following: Int!
    message: Int!
    view_opinions: Int!
    view_reactions: Int!
    view_favorites: Int!
  }
`;
