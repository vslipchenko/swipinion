import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {ActiveConversation, UnreadMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {Select, Store} from '@ngxs/store';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {getInterlocutorId} from '~app/utilities/user-messages';
import {AsyncPipe, NgIf} from '@angular/common';
import {ConversationThumbnailModule} from '~app/shared/components/conversation-thumbnail/conversation-thumbnail.module';
import {IconButtonComponent} from '~app/shared/components/icon-button/icon-button.component';
import {ConversationUserSearchModule} from '~app/shared/components/conversation-user-search/conversation-user-search.module';
import {ConversationComponent} from '~app/shared/components/conversation/conversation.component';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    AccordionComponent,
    ConversationThumbnailModule,
    IconButtonComponent,
    ConversationUserSearchModule,
    ConversationComponent,
  ],
})
export class ConversationAccordionComponent implements AfterViewInit, OnChanges, Destroyable {
  @Select(AppSelectors.unreadMessages) public unreadMessages$!: Observable<Array<UnreadMessage>>;

  @Input() public conversation!: ActiveConversation;
  @Input() public collapsable = false;
  @Output() public navigateProfile = new EventEmitter<void>();
  @Output() public afterExpand = new EventEmitter<void>();
  @Output() public afterClose = new EventEmitter<void>();

  @ViewChild(AccordionComponent, {static: true}) protected readonly accordion!: AccordionComponent;

  public readonly destroy$ = new Subject<void>();
  protected readonly renderUi$ = new BehaviorSubject(true);
  protected readonly unread$ = new BehaviorSubject(false);

  public constructor(private readonly store: Store) {}

  public ngAfterViewInit(): void {
    setTimeout(() => this.setupAccordion()); // If used without timeout accordion content is not caught up
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation'].firstChange) return;

    this.accordion.panel.open(); // Expand in case if collapsed

    const sameConversation =
      changes['conversation'].currentValue.type === changes['conversation'].previousValue.type &&
      ((changes['conversation'].currentValue.userId1 === changes['conversation'].previousValue.userId1 &&
        changes['conversation'].currentValue.userId2 === changes['conversation'].previousValue.userId2) ||
        (changes['conversation'].currentValue.userId1 === changes['conversation'].previousValue.userId2 &&
          changes['conversation'].currentValue.userId2 === changes['conversation'].previousValue.userId1));

    if (sameConversation) return; // true for saved messages & conversations between same users

    this.reinstantiateComponents();
  }

  public ngOnDestroy(): void {
    this.afterClose.emit();

    this.destroy$.next();
    this.destroy$.complete();
    this.resetActiveConversation();
  }

  protected preventCollapse(): void {
    if (!this.collapsable) this.accordion.panel.open();
  }

  protected collapseAccordions(event: MouseEvent): void {
    event.stopPropagation();

    this.navigateProfile.emit();

    if (this.collapsable) this.accordion.panel.close();
  }

  protected closeAccordion(event: MouseEvent): void {
    event.stopPropagation(); // Prevent accordion collapse

    this.store.dispatch(new SetActiveConversation(null));
  }

  private setupAccordion(): void {
    this.accordion.panel.open();

    if (!this.userConversation) return;

    this.unreadMessages$.pipe(takeUntil(this.destroy$)).subscribe((messages) => {
      const interlocutorId = getInterlocutorId(
        this.conversation.userId1,
        this.conversation.userId2,
        this.store.selectSnapshot(AppSelectors.userId),
      );

      this.unread$.next(
        // Show unread status indicator only when accordion is collapsed
        !this.accordion.panel.expanded && messages.some((message) => message.sender_id === interlocutorId),
      );
    });
  }

  private reinstantiateComponents(): void {
    this.renderUi$.next(false);

    setTimeout(() => this.renderUi$.next(true)); // This one is needed in order trigger component destroy and init
  }

  private resetActiveConversation(): void {
    // Fixes issue when messages accordion impacts accordion on the user messages page  as it's being expanded automatically and vice versa due to the state.conversation value
    this.store.dispatch(new SetActiveConversation(null));
  }

  protected get userConversation(): boolean {
    return this.conversation.type === ActiveConversationType.UserConversation;
  }

  protected get newConversation(): boolean {
    return this.conversation.type === ActiveConversationType.NewConversation;
  }

  protected get savedMessages(): boolean {
    return this.conversation.type === ActiveConversationType.SavedMessages;
  }
}
