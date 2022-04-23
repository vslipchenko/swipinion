import {gql} from 'apollo-server-core';

export const sharedEnums = gql`
  enum Language {
    en
    ru
  }
`;
