import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {UpdateUserProfile} from '~app/modules/app/store/app.actions';

export interface AppStateModel {
  profile: {
    username: string;
    thumbnail: string;
  };
}

const APP_STATE = new StateToken<AppStateModel>('app');

@State({
  name: APP_STATE,
  defaults: {
    profile: {
      username: '',
      thumbnail: '',
    },
  },
})
@Injectable()
export class AppState {
  @Action(UpdateUserProfile) private updateUserProfile(
    context: StateContext<AppStateModel>,
    action: UpdateUserProfile,
  ): void {
    context.setState((state) => ({
      ...state,
      profile: {
        ...action.payload,
      },
    }));
  }
}
