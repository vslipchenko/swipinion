import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {UINotification} from '~app/typings/user-notifications/user-notifications.interfaces';
import {NotificationType} from '~app/typings/user-notifications/user-notifications.enums';
import {MenuItem} from '~app/typings/menu/menu.interfaces';

@Component({
  selector: 'app-user-notification',
  templateUrl: './user-notification.component.html',
  styleUrls: ['./user-notification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserNotificationComponent {
  @Input() public notification = {} as UINotification;

  @Output() public accept = new EventEmitter();
  @Output() public decline = new EventEmitter();

  public followRequestOptions: Array<MenuItem> = [
    {title: 'Accept', icon: 'done', color: 'primary', click: this.accept.emit.bind(this)},
    {title: 'Decline', icon: 'close', color: 'warn', click: this.decline.emit.bind(this)},
  ];

  public hasOptions(type: NotificationType): boolean {
    return type === NotificationType.FollowRequest;
  }
}
