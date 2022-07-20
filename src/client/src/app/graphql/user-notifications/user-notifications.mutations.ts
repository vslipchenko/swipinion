import {gql} from 'apollo-angular';

export const DELETE_USER_NOTIFICATION = gql`
  mutation ($id: String!) {
    deleteUserNotification(id: $id) {
      success
    }
  }
`;
