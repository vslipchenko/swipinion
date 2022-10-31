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
import {ActiveConversation} from '~app/typings/user-messages/user-messages.interfaces';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {Store} from '@ngxs/store';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-conversation-accordion',
  templateUrl: './conversation-accordion.component.html',
  styleUrls: ['./conversation-accordion.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationAccordionComponent implements AfterViewInit, OnChanges {
  @Input() public conversation!: ActiveConversation;
  @Output() public navigateProfile = new EventEmitter<void>();

  @ViewChild(AccordionComponent, {static: true}) protected readonly accordion!: AccordionComponent;

  protected readonly renderUi$ = new BehaviorSubject(true);

  public constructor(private readonly store: Store) {}

  public ngAfterViewInit(): void {
    setTimeout(() => this.accordion.panel.open()); // If used without timeout accordion content is not caught up
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

  protected collapseAccordions(event: MouseEvent): void {
    event.stopPropagation();

    this.accordion.panel.close();

    this.navigateProfile.emit();
  }

  protected closeAccordion(event: MouseEvent): void {
    event.stopPropagation(); // Prevent accordion collapse

    this.store.dispatch(new SetActiveConversation(null));
  }

  protected get newConversation(): boolean {
    return this.conversation.type === ActiveConversationType.NewConversation;
  }

  protected get savedMessages(): boolean {
    return this.conversation.type === ActiveConversationType.SavedMessages;
  }

  private reinstantiateComponents(): void {
    this.renderUi$.next(false);

    setTimeout(() => this.renderUi$.next(true)); // This one is needed in order trigger component destroy and init
  }
}
