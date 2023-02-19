import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from '~app/modules/app/app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GraphQLModule} from '~app/graphql/graphql.module';
import {HttpClientModule} from '@angular/common/http';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {catchError, Observable, of, switchMap, tap} from 'rxjs';
import {AuthenticationInterceptorProvider} from '~app/interceptors/authentication/authentication.interceptor';
import {NgxsModule, Store} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {environment} from '~environments/environment';
import {AppState} from '~app/modules/app/store/app.state';
import {UpdateUserEssentials, UpdateUtcTimestamp} from '~app/modules/app/store/app.actions';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {AppService} from '~app/services/app/app.service';
import {HeaderComponent} from '~app/shared/components/header/header.component';
import {AddOpinionDialogComponent} from '~app/shared/components/add-opinion-dialog/add-opinion-dialog.component';
import {OpinionSuccessSnackbarModule} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.module';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {RecoveryDialogModule} from '~app/shared/components/recovery-dialog/recovery-dialog.module';
import {SignInDialogModule} from '~app/shared/components/sign-in-dialog/sign-in-dialog.module';
import {SignUpDialogModule} from '~app/shared/components/sign-up-dialog/sign-up-dialog.module';
import {UserService} from '~app/services/user/user.service';
import {MessagesPanelModule} from '~app/shared/components/messages-panel/messages-panel.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState], {developmentMode: !environment.production}),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    // Following modules considered global as they available across the app, mostly because of being used in the header or on multiple pages
    MatSnackBarModule,
    HeaderComponent,
    AddOpinionDialogComponent,
    OpinionSuccessSnackbarModule,
    EmailConfirmationDialogComponent,
    RecoveryDialogModule,
    SignInDialogModule,
    SignUpDialogModule,
    MessagesPanelModule,
  ],
  providers: [
    AuthenticationInterceptorProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: authenticationFactory,
      deps: [AuthenticationService, UserService, Store],
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: appStateFactory,
      deps: [AppService, Store],
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

// Could be dropped once any other factory is used that triggers access token refresh
function authenticationFactory(
  authenticationService: AuthenticationService,
  userService: UserService,
  store: Store,
): () => void | Observable<any> {
  return (): void | Observable<any> => {
    const refreshToken = authenticationService.getRefreshToken();

    if (!refreshToken) return;

    return authenticationService.refreshAccessToken().pipe(
      switchMap(({data}) => {
        authenticationService.accessToken$.next(data.refreshAccessToken.accessToken);

        return userService.getUserEssentials();
      }),
      tap(({data}) => {
        if (!data.userEssentials) return;

        store.dispatch(new UpdateUserEssentials(data.userEssentials));
      }),
      catchError(() => {
        return of(); // Ignore error; let auth interceptor handle authentication
      }),
    );
  };
}

function appStateFactory(appService: AppService, store: Store): () => void | Observable<any> {
  return (): void | Observable<any> => {
    return appService.getServerTimestamp().pipe(
      tap(({data}) => {
        if (!data.getServerTimestamp) return; // User client's local timestamp

        store.dispatch(new UpdateUtcTimestamp(data.getServerTimestamp));
      }),
    );
  };
}
