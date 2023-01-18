import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {MatLegacyProgressBarModule as MatProgressBarModule} from '@angular/material/legacy-progress-bar';

@NgModule({
  declarations: [ProgressBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [ProgressBarComponent],
})
export class ProgressBarModule {}
