import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {UserStatusCheckOptions} from '~app/typings/user-status/user-status.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserStatusPingService {
  public pingOptions: UserStatusCheckOptions = {checkMessage: true, checkNotification: true}; // TODO As a part of optimization consider switching checkMessage based on whether user messaging settings are set to public / private
  public readonly runStatusPing$ = new BehaviorSubject<void>(void 0); // Has to emit immediately on subscribe
}
