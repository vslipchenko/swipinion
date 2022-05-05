export enum SignInFailReason {
  Unconfirmed = 1,
  Blocked,
}

export enum AuthenticationErrorCode {
  EmptyAccessToken = '1',
  ExpiredAccessToken = '2',
  InvalidAccessToken = '3',
  EmptyRefreshToken = '4',
  // ExpiredRefreshToken = '5',
  InvalidRefreshToken = '5',
  BlockedUser = '6',
}
