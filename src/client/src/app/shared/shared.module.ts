import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {FlatButtonComponent} from './components/flat-button/flat-button.component';
import {MatButtonModule} from '@angular/material/button';
import {ButtonComponent} from './components/button/button.component';
import {InputComponent} from './components/input/input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {InputHideSuffixComponent} from './components/input/suffixes/input-hide-suffix/input-hide-suffix.component';
import {MatIconModule} from '@angular/material/icon';
import {ProgressSpinnerComponent} from './components/progress-spinner/progress-spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {CheckboxComponent} from './components/checkbox/checkbox.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {RouterModule} from '@angular/router';
import { UserNavbarComponent } from './components/user-navbar/user-navbar.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FlatButtonComponent,
    ButtonComponent,
    InputComponent,
    InputHideSuffixComponent,
    ProgressSpinnerComponent,
    CheckboxComponent,
    UserNavbarComponent,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    RouterModule,
  ],
  exports: [
    HeaderComponent,
    ButtonComponent,
    InputComponent,
    InputHideSuffixComponent,
    ProgressSpinnerComponent,
    CheckboxComponent,
  ],
})
export class SharedModule {}
