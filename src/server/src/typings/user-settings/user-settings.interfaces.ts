import {
  FollowSettings,
  MessageSettings,
  ViewFavorites,
  ViewFollowingSettings,
  ViewOpinions,
  ViewReactions,
} from './user-settings.enums';

export interface UserSettings {
  follow: FollowSettings;
  view_following: ViewFollowingSettings;
  message: MessageSettings;
  view_opinions: ViewOpinions;
  view_reactions: ViewReactions;
  view_favorites: ViewFavorites;
}
