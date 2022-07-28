import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccordionComponent} from '~app/shared/components/accordion/accordion.component';
import {MatExpansionModule} from '@angular/material/expansion';

@NgModule({
  declarations: [AccordionComponent],
  imports: [CommonModule, MatExpansionModule],
  exports: [AccordionComponent],
})
export class AccordionModule {}
