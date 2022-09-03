import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessageComponent {
  @Input() public senderId = '';
  @Input() public icon = '';
  @Input() public thumbnail = '';
  @Input() public username = '';
  @Input() public date = '';
  @Input() public message = '';
  @Input() public unread = false;

  @Output() public clicked = new EventEmitter<string>();
}
