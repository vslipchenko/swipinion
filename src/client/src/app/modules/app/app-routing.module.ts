import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryModule} from '~app/modules/entry/entry.module';
import {PageNotFoundModule} from '~app/modules/page-not-found/page-not-found.module';
import {UserModule} from '~app/modules/user/user.module';

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
    path: 'recovery',
    ...entryModule,
    data: {
      path: 'recovery',
    },
  },
  {
    path: 'confirmation',
    ...entryModule,
    data: {
      path: 'confirmation',
    },
  },
  {
    path: 'user/:username',
    loadChildren: (): Promise<typeof UserModule> => import('~app/modules/user/user.module').then((m) => m.UserModule),
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
