import {gql} from 'apollo-angular';

export const CREATE_OPINION = gql`
  mutation ($input: CreateOpinion!) {
    createOpinion(input: $input) {
      id
      type
    }
  }
`;

export const DELETE_OPINION = gql`
  mutation ($opinionId: String!) {
    deleteOpinion(opinionId: $opinionId) {
      success
    }
  }
`;
