import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface UserSettings {
  follow: FollowSettings;
  message: PrivacyCommonSettings;
  view_followers: PrivacyCommonSettings;
  view_following: PrivacyCommonSettings;
  view_opinions: PrivacyCommonSettings;
  view_reactions: PrivacyCommonSettings;
  view_favorites: PrivacyCommonSettings;
}

export interface GetUserSettingsQueryResult {
  userSettings: UserSettings;
}

export interface UpdateUserSettingsMutationResult {
  updateUserSettings: SuccessResponse;
}
