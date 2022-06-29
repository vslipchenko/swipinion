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
import {UserNavbarComponent} from './components/user-navbar/user-navbar.component';
import {CardComponent} from './components/card/card.component';
import {FabButtonComponent} from './components/fab-button/fab-button.component';
import {CardStatsComponent} from './components/card-stats/card-stats.component';
import {CardTagsComponent} from './components/card-tags/card-tags.component';
import {MenuItemsComponent} from './components/menu-items/menu-items.component';
import {MatMenuModule} from '@angular/material/menu';
import {AddOpinionDialogComponent} from './components/add-opinion-dialog/add-opinion-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';
import {TextareaComponent} from './components/textarea/textarea.component';
import {SelectComponent} from './components/select/select.component';
import {MatSelectModule} from '@angular/material/select';
import {FileBrowserComponent} from './components/file-browser/file-browser.component';
import {ImageBrowserComponent} from './components/image-browser/image-browser.component';
import {InputResetSuffixComponent} from './components/input/suffixes/input-reset-suffix/input-reset-suffix.component';
import {ChipsComponent} from './components/chips/chips.component';
import {MatChipsModule} from '@angular/material/chips';
import {IconButtonComponent} from './components/icon-button/icon-button.component';
import {OpinionSnackbarComponent} from './components/add-opinion-dialog/opinion-snackbar/opinion-snackbar.component';
import {EmptyOpinionsComponent} from './components/empty-opinions/empty-opinions.component';
import {TabsComponent} from './components/tabs/tabs.component';
import {MatTabsModule} from '@angular/material/tabs';
import {OpinionPreviewComponent} from './components/opinion-preview/opinion-preview.component';
import {MiniFabButtonComponent} from './components/mini-fab-button/mini-fab-button.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {ProgressBarComponent} from './components/progress-bar/progress-bar.component';
import {AuthClickDirective} from './directives/auth-click.directive';
// import {MatCardModule} from '@angular/material/card';
// import {MatDividerModule} from '@angular/material/divider';

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
    CardComponent,
    FabButtonComponent,
    CardStatsComponent,
    CardTagsComponent,
    MenuItemsComponent,
    AddOpinionDialogComponent,
    TextareaComponent,
    SelectComponent,
    FileBrowserComponent,
    ImageBrowserComponent,
    InputResetSuffixComponent,
    ChipsComponent,
    IconButtonComponent,
    OpinionSnackbarComponent,
    EmptyOpinionsComponent,
    TabsComponent,
    OpinionPreviewComponent,
    MiniFabButtonComponent,
    ProgressBarComponent,
    AuthClickDirective,
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
    MatMenuModule,
    MatDialogModule,
    MatSelectModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    // MatCardModule,
    // MatDividerModule,
  ],
  exports: [
    HeaderComponent,
    ButtonComponent,
    InputComponent,
    InputHideSuffixComponent,
    ProgressSpinnerComponent,
    CheckboxComponent,
    CardComponent,
    EmptyOpinionsComponent,
    TabsComponent,
    OpinionPreviewComponent,
    MiniFabButtonComponent,
    ImageBrowserComponent,
    TextareaComponent,
    ProgressBarComponent,
    MenuItemsComponent,
    AuthClickDirective,
    FlatButtonComponent,
  ],
})
export class SharedModule {}
