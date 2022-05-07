import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';
import {of, Subject, takeUntil} from 'rxjs';
import {SignInDialogComponent} from '~app/modules/entry/components/sign-in-dialog/sign-in-dialog.component';
import {Location} from '@angular/common';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {RecoveryDialogComponent} from '~app/modules/entry/components/recovery-dialog/recovery-dialog.component';

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

  public constructor(private readonly dialog: MatDialog, private readonly location: Location) {}

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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public recoverPassword(): void {
    this.location.go('/recovery');

    const dialog = this.dialog.open(RecoveryDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.emailSent.pipe(takeUntil(dialog.afterClosed())).subscribe(() => {
      dialog.close();
    });
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

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe(() => dialog.close());
  }

  // private resetLocation(): void {
  //   this.location.go('/');
  // }
}
