import {State, StateToken} from '@ngxs/store';
import {Injectable} from '@angular/core';

export interface AppStateModel {
  username: string;
  thumbnail: string;
}

const APP_STATE = new StateToken<AppStateModel>('app');

@State({
  name: APP_STATE,
  defaults: {
    username: '',
    thumbnail: '',
  },
})
@Injectable()
export class AppState {}
