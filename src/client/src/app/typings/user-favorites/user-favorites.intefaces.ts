export interface FetchUserFavoritesPayload {
  userId: string;
  edgeId?: string;
  profileOwner: boolean;
}

export interface GetUserFavorites {
  userId: string;
  edgeId?: string;
}

export interface GetUserFavoritesQueryResult {
  getFavoritesByUserId: Array<unknown>;
}
