import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OpinionPreviewComponent} from '~app/shared/components/opinion-preview/opinion-preview.component';
import {CardTagsModule} from '~app/shared/components/card-tags/card-tags.module';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MenuItemsModule} from '~app/shared/components/menu-items/menu-items.module';
import {CardStatsModule} from '~app/shared/components/card-stats/card-stats.module';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {RouterModule} from '@angular/router';

@NgModule({
  declarations: [OpinionPreviewComponent],
  imports: [
    CommonModule,
    RouterModule,
    CardTagsModule,
    ButtonComponent,
    MenuItemsModule,
    CardStatsModule,
    MatMenuModule,
  ],
  exports: [OpinionPreviewComponent],
})
export class OpinionPreviewModule {}
