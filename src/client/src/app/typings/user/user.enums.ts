export enum UserRole {
  Guest = 1, // Unauthed user
  Viewer, // Authed with read only permissions
  User, // Authed read / write permissions
}

export enum UserContentTabIndex {
  Opinions,
  Reactions,
  Favorites,
}
