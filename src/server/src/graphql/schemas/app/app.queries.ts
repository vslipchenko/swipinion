import {gql} from 'apollo-server-core';

export const appQueryTypeDefinitions = gql`
  type Query {
    getServerTimestamp: Float!
  }
`;

const getServerTimestamp = async (): Promise<number> => {
  return new Date().getTime();
};

export const appQueryResolvers = {
  Query: {
    getServerTimestamp,
  },
};