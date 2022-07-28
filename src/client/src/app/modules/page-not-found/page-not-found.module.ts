import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from './page-not-found.component';
import {RouterModule} from '@angular/router';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [PageNotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: PageNotFoundComponent,
      },
    ]),
    MatDialogModule, // TODO review these deps
    MatSnackBarModule,
  ],
})
export class PageNotFoundModule {}
