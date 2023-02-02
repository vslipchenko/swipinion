import {gql} from 'apollo-angular';

export const GET_GENERAL_OPINIONS = gql`
  query {
    getGeneralOpinions {
      id
      user_id
      type
      file_url
      title
      description
      tags
    }
  }
`;
