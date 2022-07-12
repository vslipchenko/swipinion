import {
  FollowSettings,
  MessageSettings,
  ViewFavorites,
  ViewFollowingSettings,
  ViewOpinions,
  ViewReactions,
} from '~app/typings/user-settings/user-settings.enums';

export interface UserSettings {
  follow: FollowSettings;
  view_following: ViewFollowingSettings;
  message: MessageSettings;
  view_opinions: ViewOpinions;
  view_reactions: ViewReactions;
  view_favorites: ViewFavorites;
}

export interface GetUserSettingsQueryResult {
  userSettings: UserSettings;
}
