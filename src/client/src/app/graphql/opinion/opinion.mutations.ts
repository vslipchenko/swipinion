import {gql} from 'apollo-angular';

export const REACT_TO_OPINION = gql`
  mutation ($input: ReactToOpinion!) {
    reactToOpinion(input: $input) {
      success
    }
  }
`;

export const ADD_OPINION_TO_FAVORITES = gql`
  mutation ($opinionId: String!) {
    addOpinionToFavorites(opinionId: $opinionId) {
      success
    }
  }
`;

export const REMOVE_OPINION_FROM_FAVORITES = gql`
  mutation ($opinionId: String!) {
    removeOpinionFromFavorites(opinionId: $opinionId) {
      success
    }
  }
`;
