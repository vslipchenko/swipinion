import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-user-notifications',
  templateUrl: './user-notifications.component.html',
  styleUrls: ['./user-notifications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationsComponent implements OnInit {
  public readonly loading$ = new BehaviorSubject(false);

  constructor() {}

  ngOnInit(): void {}
}
