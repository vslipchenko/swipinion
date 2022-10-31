export interface UserSearchQueryResult {
  userSearch: Array<UserEssentials>;
}

export interface UserEssentials {
  id: string;
  username: string;
  thumbnail: string;
}
