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
  @Output() public delete = new EventEmitter();

  private readonly followRequestOptions: Array<MenuItem> = [
    {title: 'Accept', icon: 'done', color: 'primary', click: (): void => this.accept.emit()},
    {title: 'Decline', icon: 'close', color: 'warn', click: (): void => this.decline.emit()},
  ];

  private readonly defaultOptions: Array<MenuItem> = [
    {title: 'Delete notification', icon: 'delete', color: 'warn', click: (): void => this.delete.emit()},
  ];

  protected getOptions(type: NotificationType): Array<MenuItem> {
    return type === NotificationType.FollowRequest ? this.followRequestOptions : this.defaultOptions;
  }
}
