import {gql} from 'apollo-angular';

export const GET_GENERAL_OPINIONS = gql`
  query ($edgeId: String) {
    getGeneralOpinions(edgeId: $edgeId) {
      id
      user_id
      username
      type
      file_url
      title
      description
      agreed
      disagreed
      comments
      tags
    }
  }
`;
