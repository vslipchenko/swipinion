import {AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild} from '@angular/core';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationAccordionComponent implements OnInit, AfterViewInit {
  @Input() public conversation!: ActiveConversation;
  @ViewChild(AccordionComponent, {static: true}) private readonly accordion!: AccordionComponent;

  protected headline = '';
  protected icon = '';
  protected thumbnail = '';

  public ngOnInit(): void {
    switch (this.conversation.type) {
      case ActiveConversationType.NewConversation:
        this.headline = 'New Message';
        break;
      case ActiveConversationType.SavedMessages:
        this.headline = 'Save Message';
        this.icon = 'bookmark';
        break;
      case ActiveConversationType.UserConversation:
        this.headline = this.conversation.username as string;
        this.thumbnail = this.conversation.thumbnail as string;
        break;
    }
  }

  public ngAfterViewInit(): void {
    setTimeout(() => this.expandAccordion()); // If used without timeout accordion content is not caught up
  }

  public expandAccordion(): void {
    this.accordion.panel.open();
  }
}
