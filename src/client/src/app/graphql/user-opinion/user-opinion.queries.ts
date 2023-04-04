import {gql} from 'apollo-angular';

export const GET_OPINIONS_BY_USERNAME = gql`
  query ($input: GetOpinions!) {
    getOpinionsByUsername(input: $input) {
      id
      type
      file_url
      body
      tags
    }
  }
`;
