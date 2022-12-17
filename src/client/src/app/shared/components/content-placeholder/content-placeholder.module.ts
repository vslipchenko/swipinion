import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ContentPlaceholderComponent} from '~app/shared/components/content-placeholder/content-placeholder.component';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';

@NgModule({
  declarations: [ContentPlaceholderComponent],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [ContentPlaceholderComponent],
})
export class ContentPlaceholderModule {}
