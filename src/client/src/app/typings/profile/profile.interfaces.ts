export interface GetProfileDataQueryResult {
  userProfile: {
    id: string;
    follower_id: string;
    bio: string;
    thumbnail: string;
  };
}
