import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserMessages} from '~app/modules/app/store/app.actions';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserMessage} from '~app/typings/user-messages/user-messages.interfaces';
import {USER_MESSAGES_FETCH_LIMIT} from '~app/constants/user-messages';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MessagesComponent implements Destroyable {
  @Select(AppSelectors.messages) public messages$!: Observable<Array<UserMessage>>;
  @Select(AppSelectors.unreadMessageTimestamp) public unreadMessageTimestamp$!: Observable<Array<UserMessage>>;

  // public readonly tabs = [
  //   {text: 'Inbox', icon: 'inbox'},
  //   {text: 'Sent', icon: 'send'},
  //   {
  //     text: 'Saved',
  //     icon: 'inventory_2',
  //   },
  // ];

  public showChat = false;

  public readonly initialLoading$ = new BehaviorSubject(true);
  public readonly chatInfo$ = new BehaviorSubject<{username?: string; thumbnail?: string; savedMessages: boolean}>({
    username: '',
    thumbnail: '',
    savedMessages: false,
  });
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public username = '';
  public messagesFetchLimit = USER_MESSAGES_FETCH_LIMIT;

  public constructor(private readonly store: Store, private readonly actions$: Actions) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserMessages)).subscribe(() => {
      this.initialLoading$.next(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
    this.initialLoading$.complete();
  }

  public spinnerInView(inView: boolean, latestMessageTimestamp: number): void {
    if (!inView) return;

    this.store.dispatch(new FetchUserMessages(latestMessageTimestamp));
  }

  public afterExpand(): void {
    const fetchedMessages = this.store.selectSnapshot(AppSelectors.messages).length;

    if (!fetchedMessages) this.store.dispatch(new FetchUserMessages());
  }

  public loadStart(): void {
    this.loading$.next(true);
  }

  public loadChat(savedMessages: boolean, username?: string, thumbnail?: string): void {
    // this.loading$.next(true);

    this.chatInfo$.next({username, thumbnail, savedMessages});

    this.showChat = true;
  }
}
