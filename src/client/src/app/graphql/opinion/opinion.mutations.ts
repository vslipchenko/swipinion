import {gql} from 'apollo-angular';

export const COMMENT_OPINION = gql`
  mutation ($input: CommentOpinion!) {
    commentOpinion(input: $input) {
      success
    }
  }
`;
