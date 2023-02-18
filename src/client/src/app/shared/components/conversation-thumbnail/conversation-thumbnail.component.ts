import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ThumbnailComponent} from '~app/shared/components/thumbnail/thumbnail.component';

@Component({
  selector: 'app-conversation-thumbnail',
  templateUrl: './conversation-thumbnail.component.html',
  styleUrls: ['./conversation-thumbnail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ThumbnailComponent],
})
export class ConversationThumbnailComponent implements OnInit {
  @Input() public username!: string;
  @Input() public thumbnail!: string;
  @Input() public newConversation!: boolean;
  @Input() public savedMessages!: boolean;

  @Output() public thumbnailClicked = new EventEmitter<MouseEvent>();

  protected headline = '';
  protected icon = '';
  protected thumbnailLink = '';
  protected userConversation = false;
  protected validConversation = false;

  public ngOnInit(): void {
    if (this.newConversation) {
      this.headline = 'New Message';
      this.icon = 'outgoing_mail';
      return;
    } else if (this.savedMessages) {
      this.headline = 'Saved Messages';
      this.icon = 'bookmark';
      return;
    }
    // Assume ActiveConversationType.UserConversation
    this.headline = this.username || 'Deleted Account';
    this.thumbnailLink = this.username ? `/user/${this.username}` : '';
    this.validConversation = Boolean(this.username);
    this.userConversation = true;
  }

  protected emitClick(event: MouseEvent): void {
    if (!this.validConversation) return;

    this.thumbnailClicked.emit(event);
  }
}
