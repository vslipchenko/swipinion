import {gql} from 'apollo-angular';

export const CREATE_USER = gql`
  mutation ($input: CreateUser!) {
    createUser(input: $input) {
      success
    }
  }
`;

export const CONFIRM_EMAIL = gql`
  mutation ($input: UserCode!) {
    confirmEmail(input: $input) {
      success
    }
  }
`;
//
export const RECOVER_PASSWORD = gql`
  mutation ($input: RecoverPassword!) {
    recoverPassword(input: $input) {
      success
    }
  }
`;

export const SET_NEW_PASSWORD = gql`
  mutation ($input: SetNewPassword!) {
    setNewPassword(input: $input) {
      success
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation ($input: ChangePassword!) {
    changePassword(input: $input) {
      success
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation ($input: EditProfile!) {
    editProfile(input: $input) {
      success
    }
  }
`;

//
// export const RESET_PASSWORD = gql`
//   mutation ($input: ResetPassword!) {
//     resetPassword(input: $input) {
//       success
//     }
//   }
// `;
