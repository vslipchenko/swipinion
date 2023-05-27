import {gql} from 'apollo-angular';

export const REACT_TO_OPINION = gql`
  mutation ($input: ReactToOpinion!) {
    reactToOpinion(input: $input) {
      success
    }
  }
`;
