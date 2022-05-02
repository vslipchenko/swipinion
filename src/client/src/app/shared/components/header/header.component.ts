import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {SignUpDialogComponent} from '~app/modules/entry/components/sign-up-dialog/sign-up-dialog.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {

  public constructor(private readonly dialog: MatDialog) {
  }

  public signUp(): void {
    this.dialog.open(SignUpDialogComponent, {panelClass: ['dialog', 'extended-dialog']});
  }
}
