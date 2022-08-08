import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
import {FetchUserMessages} from '~app/modules/app/store/app.actions';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Observable, Subject, takeUntil} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserMessage} from '~app/typings/user-messages/user-messages.interfaces';

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

  public readonly initialLoading$ = new BehaviorSubject(false);
  public readonly chatInfo$ = new BehaviorSubject<{username?: string; thumbnail?: string; savedMessages: boolean}>({
    username: '',
    thumbnail: '',
    savedMessages: false,
  });
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public username = '';

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

  public afterExpand(): void {
    console.log('after expand');

    this.initialLoading$.next(true);

    this.store.dispatch(new FetchUserMessages(''));
  }

  public loadChat(savedMessages: boolean, username?: string, thumbnail?: string): void {
    this.loading$.next(true);

    this.chatInfo$.next({username, thumbnail, savedMessages});

    this.showChat = true;
  }
}
