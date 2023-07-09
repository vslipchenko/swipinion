export interface FetchUserFavoritesPayload {
  userId: string;
  edgeId?: string;
  isProfilePath: boolean;
}

export interface GetUserFavorites {
  userId: string;
  edgeId?: string;
}

export interface GetUserFavoritesQueryResult {
  getFavoritesByUserId: Array<unknown>;
}
