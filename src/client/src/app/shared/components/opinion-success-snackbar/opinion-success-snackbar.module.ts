import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionSuccessSnackbarComponent} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [OpinionSuccessSnackbarComponent],
  imports: [CommonModule, RouterModule, ButtonComponent],
})
export class OpinionSuccessSnackbarModule {}
