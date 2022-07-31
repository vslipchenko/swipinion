import {Action, State, StateContext, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {
  RunUserStatusPolling,
  UpdateAuthedUserProfileTeaser,
  UpdateUserRole,
  UpdateUtcTimestamp,
} from '~app/modules/app/store/app.actions';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {UserRole} from '~app/typings/user/user.enums';
import {UserStatusService} from '~app/services/user-status/user-status.service';
import {Observable, tap} from 'rxjs';

export interface AppStateModel {
  profileTeaser: Omit<UserProfile, 'bio'>;
  role: UserRole;
  utcTimestamp: number;
  unreadMessage: boolean;
  unreadNotification: boolean;
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
    unreadMessage: false,
    unreadNotification: false,
    utcTimestamp: new Date().getTime(),
  },
})
@Injectable()
export class AppState {
  public constructor(private readonly userStatusService: UserStatusService) {}

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

  @Action(RunUserStatusPolling)
  private runUserStatusPolling(
    context: StateContext<AppStateModel>,
    action: RunUserStatusPolling,
  ): Observable<unknown> {
    return this.userStatusService.checkUserStatus(action.payload).pipe(
      tap(({data}) => {
        if (!data.checkUserStatus) return;

        context.setState((state) => ({
          ...state,
          ...data.checkUserStatus,
        }));
      }),
    );
  }
}
