import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {Store} from '@ngxs/store';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationAccordionComponent implements OnInit, AfterViewInit {
  @Input() public conversation!: ActiveConversation;
  @Output() public navigateProfile = new EventEmitter<void>();

  @ViewChild(AccordionComponent, {static: true}) protected readonly accordion!: AccordionComponent;

  protected headline = '';
  protected icon = '';
  // protected svgIcon = '';
  protected thumbnail = '';
  protected thumbnailLink = '';
  protected userConversation = false;
  protected newConversation = false;
  protected savedMessages = false;
  protected validConversation = false;

  public constructor(private readonly store: Store) {}

  public ngOnInit(): void {
    switch (this.conversation.type) {
      case ActiveConversationType.NewConversation:
        this.headline = 'New Message';
        this.icon = 'outgoing_mail';
        this.newConversation = true;
        break;
      case ActiveConversationType.SavedMessages:
        this.headline = 'Saved Messages';
        this.icon = 'bookmark';
        this.savedMessages = true;
        break;
      case ActiveConversationType.UserConversation:
        this.headline = this.conversation.username || 'Deleted Account';
        this.thumbnailLink = this.conversation.username ? `/user/${this.conversation.username}` : '';
        this.validConversation = Boolean(this.conversation.username);
        this.thumbnail = this.conversation.thumbnail;
        this.userConversation = true;
        break;
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.expandAccordion()); // If used without timeout accordion content is not caught up
  }

  protected collapseAccordions(event: MouseEvent): void {
    if (!this.validConversation) return;

    event.stopPropagation();

    this.accordion.panel.close();

    this.navigateProfile.emit();
  }

  protected closeAccordion(event: MouseEvent): void {
    event.stopPropagation(); // Prevent accordion collapse

    this.store.dispatch(new SetActiveConversation(null));
  }

  private expandAccordion(): void {
    this.accordion.panel.open();
  }
}
