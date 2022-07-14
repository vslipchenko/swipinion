export interface GetProfileDataQueryResult {
  userProfile: {
    id: string;
    follower_id: string;
    pending: boolean; // pending following
    bio: string;
    thumbnail: string;
  };
}
