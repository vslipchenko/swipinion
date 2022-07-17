import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';

export class FetchProfileSettings {
  public static readonly type = '[UserSettings] FetchProfileSettings';
}

export class UpdateProfileSettings {
  public static readonly type = '[UserSettings] UpdateProfileSettings';

  public constructor(public payload: UserSettings) {}
}
