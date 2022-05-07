import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';
import {of, Subject, takeUntil} from 'rxjs';
import {SignInDialogComponent} from '~app/modules/entry/components/sign-in-dialog/sign-in-dialog.component';
import {Location} from '@angular/common';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, Destroyable {
  @Input() public showSignIn = of<void>();
  @Input() public showSignUp = of<void>();

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
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public signIn(): void {
    this.location.go('/sign-in');

    this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }

  public signUp(): void {
    this.location.go('/sign-up');

    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe(() => dialog.close());
  }
}
