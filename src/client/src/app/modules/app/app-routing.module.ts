import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EntryModule} from '~app/modules/entry/entry.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: (): Promise<typeof EntryModule> =>
      import('~app/modules/entry/entry.module').then((m) => m.EntryModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
