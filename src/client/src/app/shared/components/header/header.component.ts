import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {merge, Observable, of, Subject, takeUntil} from 'rxjs';
import {Location} from '@angular/common';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {Router} from '@angular/router';
import {SignInDialogComponent} from '~app/shared/components/sign-in-dialog/sign-in-dialog.component';
import {SignUpDialogComponent} from '~app/shared/components/sign-up-dialog/sign-up-dialog.component';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {RecoveryDialogComponent} from '~app/shared/components/recovery-dialog/recovery-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, Destroyable {
  @Input() public showSignIn = of<void>();
  @Input() public showSignUp = of<void>();
  @Input() public showPasswordRecovery = of<void>();

  public readonly destroy$ = new Subject<void>();
  public readonly authenticated$: Observable<boolean>;

  public constructor(
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly authenticationService: AuthenticationService, // private readonly history: Navi,
    private readonly router: Router,
  ) {
    this.authenticated$ = this.authenticationService.authenticated$;
  }

  public ngOnInit(): void {
    this.showSignIn.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.signIn(false);
    });

    this.showSignUp.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.signUp(false);
    });

    this.showPasswordRecovery.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.recoverPassword(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public signIn(changeLocation: boolean, data?: {email: string; password: string}): void {
    if (changeLocation) this.location.go('/sign-in');

    const dialog = this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'extended-dialog'], data});

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
      dialog.close();
      if (this.isHomepageScope) this.resetLocation();
    });

    this.listenDialogClose(dialog);
  }

  public signUp(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/sign-up');

    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe((email) => {
      dialog.close();
      this.confirmEmail(email);
    });

    this.listenDialogClose(dialog);
  }

  private confirmEmail(email = '', data?: {email: string; password: string}): void {
    // if (changeLocation) this.location.go('/confirmation', `email=${encodeURI(email)}`);

    const dialog = this.dialog.open(EmailConfirmationDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.email = email;
    dialog.componentInstance.emailConfirmed.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(this.isHomepageScope, data);
    });

    this.listenDialogClose(dialog);
  }

  private recoverPassword(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/recovery');

    const dialog = this.dialog.open(RecoveryDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

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

  public get isHomepageScope(): boolean {
    return ['/', '/sign-in', '/sign-up', '/recovery'].includes(this.router.url);
  }
}
