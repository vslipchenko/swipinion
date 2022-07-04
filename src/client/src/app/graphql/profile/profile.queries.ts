import {gql} from 'apollo-angular';

export const GET_PROFILE_DATA = gql`
  query ($username: String!) {
    userProfile(username: $username) {
      id
      follower_id
      bio
      thumbnail
    }
  }
`;
