import {gql} from 'apollo-server-core';

export const appQueryTypeDefinitions = gql`
  type Query {
    getServerTimestamp: Float!
  }
`;

const getServerTimestamp = (): number => {
  return new Date().getTime();
};

export const appQueryResolvers = {
  Query: {
    getServerTimestamp,
  },
};
