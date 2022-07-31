import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserStatusPingerService {
  public readonly runMessagePolling$ = new BehaviorSubject(true);
  public readonly runNotificationPolling$ = new BehaviorSubject(true);
}
