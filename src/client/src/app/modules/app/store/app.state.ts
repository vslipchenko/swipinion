import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateUserProfile, UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';

export interface AppStateModel {
  profile: UserProfile;
  role: UserRole;
}

const APP_STATE = new StateToken<AppStateModel>('app');

@State({
  name: APP_STATE,
  defaults: {
    profile: {
      username: '',
      bio: '',
      thumbnail: '',
    },
    role: UserRole.Guest,
  },
})
@Injectable()
export class AppState {
  @Action(UpdateUserProfile)
  private updateUserProfile(context: StateContext<AppStateModel>, action: UpdateUserProfile): void {
    context.setState((state) => ({
      ...state,
      profile: {
        ...state.profile,
        ...action.payload,
      },
    }));
  }

  @Action(UpdateUserRole)
  private updateUserRole(context: StateContext<AppStateModel>, action: UpdateUserRole): void {
    context.setState((state) => ({
      ...state,
      role: action.payload,
    }));
  }
}
