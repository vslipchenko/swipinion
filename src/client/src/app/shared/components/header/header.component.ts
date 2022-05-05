import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';
import {takeUntil} from 'rxjs';
import {SignInDialogComponent} from '~app/modules/entry/components/sign-in-dialog/sign-in-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  public constructor(private readonly dialog: MatDialog) {}

  public signIn(): void {
    this.dialog.open(SignInDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }

  public signUp(): void {
    const dialog = this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});

    dialog.componentInstance.signedUp.pipe(takeUntil(dialog.afterClosed())).subscribe(() => dialog.close());
  }
}
