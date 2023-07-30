import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {distinctUntilChanged, filter, map, merge, of, take, takeUntil} from 'rxjs';
import {AsyncPipe, Location, NgIf} from '@angular/common';
import {untilDestroyed} from '~app/utilities/operator';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {SignInDialogComponent} from '~app/shared/components/sign-in-dialog/sign-in-dialog.component';
import {SignUpDialogComponent} from '~app/shared/components/sign-up-dialog/sign-up-dialog.component';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {RecoveryDialogComponent} from '~app/shared/components/recovery-dialog/recovery-dialog.component';
import {USER_STATUS_POLLING_INTERVAL} from '~app/constants/user-status';
import {RunUserStatusPolling} from '~app/modules/app/store/app.actions';
import {UserStatusPingService} from '~app/services/user-status-ping/user-status-ping.service';
import {Store} from '@ngxs/store';
import {UserStatusCheckOptions} from '~app/typings/user-status/user-status.interfaces';
import {UserNavbarComponent} from '~app/shared/components/user-navbar/user-navbar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [AsyncPipe, NgIf, RouterLink, UserNavbarComponent, ButtonComponent, FlatButtonComponent],
})
export class HeaderComponent implements OnInit {
  @Input() public showSignIn = of<void>();
  @Input() public showSignUp = of<void>();
  @Input() public showPasswordRecovery = of<void>();

  protected readonly authenticated: boolean = false;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly authenticationService: AuthenticationService, // private readonly history: Navi,
    private readonly router: Router,
    private readonly userStatusPingService: UserStatusPingService,
    private readonly store: Store,
  ) {
    this.authenticated = this.authenticationService.authenticated;
  }

  public ngOnInit(): void {
    this.showSignIn.pipe(this.untilDestroyed()).subscribe(() => {
      this.signIn(false);
    });

    this.showSignUp.pipe(this.untilDestroyed()).subscribe(() => {
      this.signUp(false);
    });

    this.showPasswordRecovery.pipe(this.untilDestroyed()).subscribe(() => {
      this.recoverPassword(false);
    });

    if (this.authenticationService.authenticated) {
      this.router.events
        .pipe(
          this.untilDestroyed(),
          filter((event) => event instanceof NavigationEnd),
          take(1),
        )
        .subscribe((event: any) => {
          if (event.url === '/profile/notifications') {
            this.userStatusPingService.pingOptions = {
              ...this.userStatusPingService.pingOptions,
              checkNotification: false,
            };
          }

          this.runUserStatusPolling();
        });
    }
  }

  protected signIn(changeLocation: boolean, data?: {email: string; password: string}): void {
    if (changeLocation) this.location.go('/sign-in');

    const dialog = this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'small-dialog'], data});

    dialog.componentInstance.signUp.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signUp(this.isHomepageScope);
    });

    dialog.componentInstance.recover.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.recoverPassword(this.isHomepageScope);
    });

    dialog.componentInstance.confirm.pipe(takeUntil(dialog.afterClosed())).subscribe((data) => {
      dialog.close();
      this.confirmEmail(data.email, data);
    });

    dialog.componentInstance.authenticated.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      if (this.isHomepageScope) this.resetLocation();

      window.location.reload(); // Reload in order to actualize a user state; this fixes stale user state data
    });

    this.listenDialogClose(dialog);
  }

  protected signUp(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/sign-up');

    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'small-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe((email) => {
      dialog.close();
      this.confirmEmail(email);
    });

    this.listenDialogClose(dialog);
  }

  private confirmEmail(email = '', data?: {email: string; password: string}): void {
    // if (changeLocation) this.location.go('/confirmation', `email=${encodeURI(email)}`);

    const dialog = this.dialog.open(EmailConfirmationDialogComponent, {panelClass: ['dialog', 'small-dialog']});

    dialog.componentInstance.email = email;
    dialog.componentInstance.emailConfirmed.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(this.isHomepageScope, data);
    });

    this.listenDialogClose(dialog);
  }

  private recoverPassword(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/recovery');

    const dialog = this.dialog.open(RecoveryDialogComponent, {panelClass: ['dialog', 'small-dialog']});

    dialog.componentInstance.recovered.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(this.isHomepageScope);
    });

    this.listenDialogClose(dialog);
  }

  private listenDialogClose(dialog: MatDialogRef<any>): void {
    if (!this.isHomepageScope) return;

    merge(dialog.backdropClick(), dialog.componentInstance.cancel)
      .pipe(takeUntil(dialog.afterClosed()))
      .subscribe(() => {
        this.resetLocation();
      });
  }

  private resetLocation(): void {
    this.location.go('/');
  }

  private runUserStatusPolling(): void {
    // TODO move script to web worker in order to guarantee stable setInterval callback run as az browser throttles inactive tabs
    let interval: number;

    this.userStatusPingService.runStatusPing$
      .pipe(
        this.untilDestroyed(),
        map(() => this.userStatusPingService.pingOptions),
        distinctUntilChanged((previous, current) => {
          return (
            previous.checkMessage === current.checkMessage &&
            previous.checkNotification === current.checkNotification &&
            previous.dispatchActionAfterStatusChecked === current.dispatchActionAfterStatusChecked
          );
        }),
      )
      .subscribe((options) => {
        // Always clear interval as each new interval is set on each subsequent subscription callback call
        clearInterval(interval);

        if (!options.checkMessage && !options.checkNotification) return;
        // Run immediately
        this.dispatchUserStatusPolling(options);

        interval = this.setPollingInterval();
      });
  }

  private dispatchUserStatusPolling(options: UserStatusCheckOptions): void {
    // if (document.hidden) return; // Prevent polling when tab is inactive

    this.store.dispatch(new RunUserStatusPolling(options));
  }

  private setPollingInterval(): number {
    return setInterval(() => {
      this.dispatchUserStatusPolling(this.userStatusPingService.pingOptions); // This one has to reference pingOptions object directly in order to avlid irrelevant value binding due to clojure
    }, USER_STATUS_POLLING_INTERVAL);
  }

  protected get isHomepageScope(): boolean {
    return ['/', '/sign-in', '/sign-up', '/recovery'].includes(this.router.url);
  }
}
