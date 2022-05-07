import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryModule} from '~app/modules/entry/entry.module';
import {PageNotFoundModule} from '~app/modules/page-not-found/page-not-found.module';

const entryModule = {
  pathMatch: 'full',
  loadChildren: (): Promise<typeof EntryModule> => import('~app/modules/entry/entry.module').then((m) => m.EntryModule),
};

const routes: Routes = [
  {
    path: '',
    ...entryModule,
  },
  {
    path: 'sign-in',
    ...entryModule,
    data: {
      path: 'sign-in',
    },
  },
  {
    path: 'sign-up',
    ...entryModule,
    data: {
      path: 'sign-up',
    },
  },
  {
    path: '**',
    loadChildren: (): Promise<typeof PageNotFoundModule> =>
      import('~app/modules/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
