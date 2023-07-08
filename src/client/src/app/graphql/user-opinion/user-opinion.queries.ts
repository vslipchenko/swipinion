import {gql} from 'apollo-angular';

export const GET_OPINIONS_BY_USER_ID = gql`
  query ($input: GetOpinions!) {
    getOpinionsByUserId(input: $input) {
      id
      type
      file_url
      body
      tags
    }
  }
`;
