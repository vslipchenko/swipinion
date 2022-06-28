import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from '~app/modules/app/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GraphQLModule} from '~app/graphql/graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {catchError, Observable, of, tap} from 'rxjs';
import {AuthenticationInterceptorProvider} from '~app/interceptors/authentication/authentication.interceptor';
import {NgxsModule, Store} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {environment} from '~environments/environment';
import {AppState} from '~app/modules/app/store/app.state';
import {UpdateUserProfile} from '~app/modules/app/store/app.actions';
import {SharedModule} from '~app/shared/shared.module';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState]),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    MatSnackBarModule,
    SharedModule,
  ],
  providers: [
    AuthenticationInterceptorProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: authenticationFactory,
      deps: [AuthenticationService, Store],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// Could be dropped once any other factory is used that triggers access token refresh
function authenticationFactory(
  authenticationService: AuthenticationService,
  store: Store,
): () => void | Observable<any> {
  return (): void | Observable<any> => {
    const refreshToken = authenticationService.getRefreshToken();

    if (!refreshToken) return;

    return authenticationService.refreshAccessToken().pipe(
      tap(({data}) => {
        authenticationService.accessToken$.next(data.refreshAccessToken.accessToken);

        store.dispatch(
          new UpdateUserProfile({
            thumbnail: data.refreshAccessToken.thumbnail,
            username: data.refreshAccessToken.username,
            bio: data.refreshAccessToken.bio, // TODO fetch bio apart from thumbnail & username
          }),
        );
      }),
      catchError(() => {
        return of(); // Ignore error; let auth interceptor handle authentication
      }),
    );
  };
}
