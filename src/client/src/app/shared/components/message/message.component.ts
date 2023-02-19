import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, ThumbnailComponent],
})
export class MessageComponent {
  @Input() public senderId = '';
  @Input() public icon = '';
  @Input() public thumbnail = '';
  @Input() public username = '';
  @Input() public date = '';
  @Input() public message = '';
  @Input() public unread = false;
  @Input() public outgoing = false;

  @Output() public clicked = new EventEmitter<string>();
}
