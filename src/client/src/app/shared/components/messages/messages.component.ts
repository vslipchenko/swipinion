import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserMessages} from '~app/modules/app/store/app.actions';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Observable, Subject, take, takeUntil} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UIUserMessage, UnreadMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {USER_MESSAGES_FETCH_LIMIT} from '~app/constants/user-messages';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements Destroyable {
  @Select(AppSelectors.messages) public messages$!: Observable<Array<UIUserMessage>>;
  @Select(AppSelectors.unreadMessages) public unreadMessages$!: Observable<Array<UnreadMessage>>;

  // public readonly tabs = [
  //   {text: 'Inbox', icon: 'inbox'},
  //   {text: 'Sent', icon: 'send'},
  //   {
  //     text: 'Saved',
  //     icon: 'inventory_2',
  //   },
  // ];

  public showConversation = false;

  public readonly conversationInfo$ = new BehaviorSubject<{message?: UIUserMessage; savedMessages: boolean}>({
    message: {
      id: '',
      sender_id: '',
      recipient_id: '',
      teaser: '',
      username: '',
      thumbnail: '',
      date: '',
      read: false,
      unread: false,
      created_at: 0,
    },
    savedMessages: false,
  });
  public readonly messagesFetchLimit = USER_MESSAGES_FETCH_LIMIT;
  public readonly loading$ = new BehaviorSubject(true);
  public readonly destroy$ = new Subject<void>();
  public userId = '';

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.userId = this.store.selectSnapshot(AppSelectors.userId);

    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserMessages), take(1)).subscribe(() => {
      this.loading$.next(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public spinnerInView(inView: boolean, edgeMessageId: string): void {
    if (!inView) return;

    this.store.dispatch(new FetchUserMessages(edgeMessageId));
  }

  public afterExpand(): void {
    const fetchedMessages = this.store.selectSnapshot(AppSelectors.messages).length;

    if (!fetchedMessages) this.store.dispatch(new FetchUserMessages());
  }

  public loadConversation(savedMessages: boolean, message?: UIUserMessage): void {
    this.conversationInfo$.next({message: message || ({} as UIUserMessage), savedMessages});

    this.showConversation = true;
  }
}
