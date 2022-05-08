import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';
import {of, Subject, takeUntil} from 'rxjs';
import {SignInDialogComponent} from '~app/modules/entry/components/sign-in-dialog/sign-in-dialog.component';
import {Location} from '@angular/common';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {RecoveryDialogComponent} from '~app/modules/entry/components/recovery-dialog/recovery-dialog.component';
import {EmailConfirmationDialogComponent} from '~app/modules/entry/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {ActivatedRoute} from '@angular/router';

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

  public constructor(
    private readonly dialog: MatDialog,
    private readonly location: Location,
    private readonly activatedRoute: ActivatedRoute,
  ) {}

  public ngOnInit(): void {
    this.showSignIn.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.signIn();
    });

    this.showSignUp.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.signUp();
    });

    this.showPasswordRecovery.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      this.recoverPassword();
    });

    this.showEmailConfirmation.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // console.log('SIGN IN');
      const email = decodeURI(this.activatedRoute.snapshot.queryParams['email']);
      this.confirmEmail(email);
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public signIn(): void {
    this.location.go('/sign-in');

    const dialog = this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.recover.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.recoverPassword();
    });
  }

  public signUp(): void {
    this.location.go('/sign-up');

    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe((email) => {
      dialog.close();
      this.confirmEmail(email);
    });
  }

  private confirmEmail(email: string): void {
    this.location.go('/confirmation', `email=${encodeURI(email)}`);

    const dialog = this.dialog.open(EmailConfirmationDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.emailConfirmed.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
      this.signIn(); // TODO pass & set email as well
    });
  }

  private recoverPassword(): void {
    this.location.go('/recovery');

    const dialog = this.dialog.open(RecoveryDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.emailSent.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
    });
  }

  // private resetLocation(): void {
  //   this.location.go('/');
  // }
}
