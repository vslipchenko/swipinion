import {gql} from 'apollo-angular';

export const GET_USER_NOTIFICATIONS = gql`
  query ($edgeId: String) {
    userNotifications(edgeId: $edgeId) {
      id
      type
      username
      thumbnail
      follower_record_id
      created_at
    }
  }
`;
