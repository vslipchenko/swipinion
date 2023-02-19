import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionPreviewComponent} from '~app/shared/components/opinion-preview/opinion-preview.component';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {CardStatsComponent} from '~app/shared/components/card-stats/card-stats.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [OpinionPreviewComponent],
  imports: [
    CommonModule,
    RouterModule,
    CardTagsComponent,
    ButtonComponent,
    MenuItemsComponent,
    CardStatsComponent,
    MatMenuModule,
  ],
  exports: [OpinionPreviewComponent],
})
export class OpinionPreviewModule {}
