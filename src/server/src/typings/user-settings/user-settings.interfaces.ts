import {FollowSettings, PrivacyCommonSettings} from './user-settings.enums';

export interface UserSettings {
  follow: FollowSettings;
  message: PrivacyCommonSettings;
  view_followers: PrivacyCommonSettings;
  view_following: PrivacyCommonSettings;
  view_opinions: PrivacyCommonSettings;
  view_reactions: PrivacyCommonSettings;
  view_favorites: PrivacyCommonSettings;
}
