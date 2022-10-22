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
  @ViewChild(AccordionComponent, {static: true}) private readonly accordionComponent!: AccordionComponent;

  protected headline = '';

  public ngOnInit(): void {
    this.headline =
      this.conversation.type === ActiveConversationType.UserConversation
        ? (this.conversation.username as string)
        : this.conversation.type === ActiveConversationType.NewConversation
        ? 'New Message'
        : 'Save Message';
  }

  public ngAfterViewInit(): void {
    this.expandAccordion();
  }

  public expandAccordion(): void {
    this.accordionComponent.accordion.openAll();
  }
}
