import {Directive, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, take} from 'rxjs';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {FetchUserMessages, UserStatusUpdatedBeforeMessagesInitialFetch} from '~app/modules/app/store/app.actions';
import {untilDestroyed} from '~app/utilities/operator';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserStatusPingService} from '~app/services/user-status-ping/user-status-ping.service';

@Directive({
  selector: '[appMessages]',
  standalone: true,
})
export class MessagesDirective implements OnInit, OnDestroy {
  public readonly loading$ = new BehaviorSubject(false);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly userStatusPingService: UserStatusPingService,
  ) {}

  public ngOnInit(): void {
    if (this.messagesInitialized) return;

    this.actions$.pipe(this.untilDestroyed(), ofActionCompleted(FetchUserMessages), take(1)).subscribe(() => {
      this.loading$.next(false);
    });

    this.actions$
      .pipe(this.untilDestroyed(), ofActionCompleted(UserStatusUpdatedBeforeMessagesInitialFetch), take(1))
      .subscribe(() => {
        this.setDispatchActionAfterStatusChecked(false);

        this.store.dispatch(new FetchUserMessages());
      });
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  public initializeMessages(): void {
    if (this.messagesInitialized) return; // Getter has to be used as a static variable may cause issue with messages accordion spinner as it contains previous value

    this.loading$.next(true);

    this.setDispatchActionAfterStatusChecked(true);

    this.userStatusPingService.runStatusPing$.next();
  }

  private setDispatchActionAfterStatusChecked(value: boolean): void {
    this.userStatusPingService.pingOptions = {
      ...this.userStatusPingService.pingOptions,
      dispatchActionAfterStatusChecked: value,
    };
  }

  private get messagesInitialized(): boolean {
    return this.store.selectSnapshot(AppSelectors.messagesInitialized);
  }
}
