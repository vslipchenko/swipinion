import {NgModule} from '@angular/core';
import {RouteReuseStrategy, RouterModule, Routes} from '@angular/router';
import {EntryModule} from '~app/modules/entry/entry.module';
import {PageNotFoundModule} from '~app/modules/page-not-found/page-not-found.module';
import {UserModule} from '~app/modules/user/user.module';
import {UserCanActivateGuard} from '~app/guards/user/can-activate/user-can-activate.guard';
import {UserCanLoadGuard} from '~app/guards/user/can-load/user-can-load.guard';
import {UserRoleResolver} from '~app/resolvers/user-role/user-role.resolver';
import {UserProfileResolver} from '~app/resolvers/user-profile/user-profile.resolver';
import {CustomRouteReuseStrategy} from '~app/strategies/route-reuse-strategy';

const entryModule = {
  pathMatch: 'full',
  loadChildren: (): Promise<typeof EntryModule> => import('~app/modules/entry/entry.module').then((m) => m.EntryModule),
};

const userModule = {
  loadChildren: (): Promise<typeof UserModule> => import('~app/modules/user/user.module').then((m) => m.UserModule),
  canLoad: [UserCanLoadGuard],
  canActivate: [UserCanActivateGuard],
  resolve: {
    role: UserRoleResolver,
    profile: UserProfileResolver,
  },
};

const routes: Routes = [
  {
    path: '',
    ...entryModule,
  },
  {
    path: 'opinion/:username/:id',
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
    path: 'profile',
    ...userModule,
  },
  {
    path: 'user/:username',
    ...userModule,
    data: {
      disableRouteReuse: true, // Allows to reinstantiate components when navigating between different user profile, e.g. /user/boo -> /user/foo
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
  providers: [{provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy}],
})
export class AppRoutingModule {}
