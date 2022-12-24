import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [TextareaComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  exports: [TextareaComponent],
})
export class TextareaModule {}
