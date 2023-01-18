import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressSpinnerComponent} from '~app/shared/components/progress-spinner/progress-spinner.component';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';

@NgModule({
  declarations: [ProgressSpinnerComponent],
  imports: [CommonModule, MatProgressSpinnerModule],
  exports: [ProgressSpinnerComponent],
})
export class ProgressSpinnerModule {}
