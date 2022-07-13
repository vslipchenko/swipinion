import {FollowSettings, PrivacyCommonSettings} from './user-settings.enums';

export interface UserSettings {
  follow: FollowSettings;
  view_following: PrivacyCommonSettings;
  message: PrivacyCommonSettings;
  view_opinions: PrivacyCommonSettings;
  view_reactions: PrivacyCommonSettings;
  view_favorites: PrivacyCommonSettings;
}
