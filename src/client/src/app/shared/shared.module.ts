import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import { FlatButtonComponent } from './components/flat-button/flat-button.component';
import {MatButtonModule} from '@angular/material/button';
import { ButtonComponent } from './components/button/button.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FlatButtonComponent,
    ButtonComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  exports: [
    HeaderComponent,
  ],
})
export class SharedModule {
}
