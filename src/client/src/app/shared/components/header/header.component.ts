import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';
import {merge, of, Subject, takeUntil} from 'rxjs';
import {SignInDialogComponent} from '~app/modules/entry/components/sign-in-dialog/sign-in-dialog.component';
import {Location} from '@angular/common';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {RecoveryDialogComponent} from '~app/modules/entry/components/recovery-dialog/recovery-dialog.component';
import {EmailConfirmationDialogComponent} from '~app/modules/entry/components/email-confirmation-dialog/email-confirmation-dialog.component';

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
  @Input() public showEmailConfirmation = of<void>();

  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly dialog: MatDialog, private readonly location: Location) {}

  public ngOnInit(): void {
    this.showSignIn.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.signIn(false);
    });

    this.showSignUp.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.signUp(false);
    });

    this.showPasswordRecovery.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.recoverPassword(false);
    });

    this.showEmailConfirmation.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      // const email = decodeURI(this.activatedRoute.snapshot.queryParams['email']);
      this.confirmEmail(false);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public signIn(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/sign-in');

    const dialog = this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.recover.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.recoverPassword(true);
    });

    dialog.componentInstance.confirm.pipe(takeUntil(dialog.afterClosed())).subscribe((email) => {
      dialog.close();
      this.confirmEmail(true, email);
    });

    this.listenDialogCancel(dialog);
  }

  public signUp(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/sign-up');

    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe((email) => {
      dialog.close();
      this.confirmEmail(true, email);
    });

    this.listenDialogCancel(dialog);
  }

  private confirmEmail(changeLocation: boolean, email = ''): void {
    if (changeLocation) this.location.go('/confirmation', `email=${encodeURI(email)}`);

    const dialog = this.dialog.open(EmailConfirmationDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.email = email;
    dialog.componentInstance.emailConfirmed.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(true);
    });

    this.listenDialogCancel(dialog);
  }

  private recoverPassword(changeLocation: boolean): void {
    if (changeLocation) this.location.go('/recovery');

    const dialog = this.dialog.open(RecoveryDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.recovered.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(true);
    });

    this.listenDialogCancel(dialog);
  }

  private listenDialogCancel(dialog: MatDialogRef<any>): void {
    merge(dialog.backdropClick(), dialog.componentInstance.cancel)
      .pipe(takeUntil(dialog.afterClosed()))
      .subscribe(() => {
        this.resetLocation();
      });
  }

  private resetLocation(): void {
    this.location.go('/');
  }
}
