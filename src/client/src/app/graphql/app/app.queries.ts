import {gql} from 'apollo-angular';

export const GET_SERVER_TIMESTAMP = gql`
  query {
    getServerTimestamp
  }
`;
