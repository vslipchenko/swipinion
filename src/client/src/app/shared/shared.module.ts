import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import { FlatButtonComponent } from './components/flat-button/flat-button.component';
import {MatButtonModule} from '@angular/material/button';
import { ButtonComponent } from './components/button/button.component';
import { InputComponent } from './components/input/input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    HeaderComponent,
    FlatButtonComponent,
    ButtonComponent,
    InputComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    HeaderComponent,
    ButtonComponent,
    InputComponent,
  ],
})
export class SharedModule {
}
