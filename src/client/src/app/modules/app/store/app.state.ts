import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateAuthedUserProfileTeaser, UpdateUserRole} from '~app/modules/app/store/app.actions';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';

export interface AppStateModel {
  profileTeaser: Omit<UserProfile, 'bio'>;
  role: UserRole;
}

const APP_STATE = new StateToken<AppStateModel>('app');

@State({
  name: APP_STATE,
  defaults: {
    profileTeaser: {
      username: '',
      // bio: '',
      thumbnail: '',
    },
    role: UserRole.Guest,
  },
})
@Injectable()
export class AppState {
  @Action(UpdateAuthedUserProfileTeaser)
  private updateUserProfile(context: StateContext<AppStateModel>, action: UpdateAuthedUserProfileTeaser): void {
    context.setState((state) => ({
      ...state,
      profileTeaser: {
        ...state.profileTeaser,
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
