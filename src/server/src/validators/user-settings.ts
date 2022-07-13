import Joi from 'joi';
import {UserSettings} from '../typings/user-settings/user-settings.interfaces';
import {getNumericEnumValues} from '../utilities/enum';
import {FollowSettings, PrivacyCommonSettings} from '../typings/user-settings/user-settings.enums';

export const updateUserSettingsValidator = Joi.object<UserSettings>({
  follow: Joi.number().valid(...getNumericEnumValues(FollowSettings)),
  view_following: Joi.number().valid(...getNumericEnumValues(PrivacyCommonSettings)),
  message: Joi.number().valid(...getNumericEnumValues(PrivacyCommonSettings)),
  view_opinions: Joi.number().valid(...getNumericEnumValues(PrivacyCommonSettings)),
  view_reactions: Joi.number().valid(...getNumericEnumValues(PrivacyCommonSettings)),
  view_favorites: Joi.number().valid(...getNumericEnumValues(PrivacyCommonSettings)),
});
