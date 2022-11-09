import {Directive, OnInit} from '@angular/core';
import {BehaviorSubject, Subject, take, takeUntil} from 'rxjs';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {FetchUserMessages, UserStatusUpdatedBeforeMessagesInitialFetch} from '~app/modules/app/store/app.actions';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserStatusPingService} from '~app/services/user-status-ping/user-status-ping.service';

@Directive({
  selector: '[appMessages]',
})
export class MessagesDirective implements OnInit, Destroyable {
  public readonly destroy$ = new Subject<void>();
  public readonly loading$ = new BehaviorSubject(true);

  public constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly userStatusPingService: UserStatusPingService,
  ) {}

  public ngOnInit(): void {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(FetchUserMessages), take(1)).subscribe(() => {
      this.loading$.next(false);
    });

    this.actions$
      .pipe(takeUntil(this.destroy$), ofActionCompleted(UserStatusUpdatedBeforeMessagesInitialFetch), take(1))
      .subscribe(() => {
        this.setDispatchActionAfterStatusChecked(false);

        this.store.dispatch(new FetchUserMessages());
      });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public initializeMessages(): void {
    const messagesInitialized = this.store.selectSnapshot(AppSelectors.messagesInitialized);

    if (messagesInitialized) return;

    this.setDispatchActionAfterStatusChecked(true);

    this.userStatusPingService.runStatusPing$.next();
  }

  private setDispatchActionAfterStatusChecked(value: boolean): void {
    this.userStatusPingService.pingOptions = {
      ...this.userStatusPingService.pingOptions,
      dispatchActionAfterStatusChecked: value,
    };
  }
}
