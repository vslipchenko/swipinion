import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionSuccessSnackbarComponent} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.component';
import {ButtonModule} from '~app/shared/components/button/button.module';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [OpinionSuccessSnackbarComponent],
  imports: [CommonModule, RouterModule, ButtonModule],
})
export class OpinionSuccessSnackbarModule {}
