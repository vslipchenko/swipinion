import {gql} from 'apollo-angular';

export const CREATE_OPINION = gql`
  mutation ($input: CreateOpinion!) {
    createOpinion(input: $input)
  }
`;
