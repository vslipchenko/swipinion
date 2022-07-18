import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateAuthedUserProfileTeaser, UpdateUserRole, UpdateUtcTimestamp} from '~app/modules/app/store/app.actions';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';

export interface AppStateModel {
  profileTeaser: Omit<UserProfile, 'bio'>;
  role: UserRole;
  utcTimestamp: number;
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
    utcTimestamp: new Date().getTime(),
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

  @Action(UpdateUtcTimestamp)
  private updateUtcTimestamp(context: StateContext<AppStateModel>, action: UpdateUtcTimestamp): void {
    context.setState((state) => ({
      ...state,
      utcTimestamp: action.payload,
    }));
  }
}
