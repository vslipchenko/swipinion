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
import {OpinionAddedSnackbarComponent} from '~app/shared/components/opinion-added-snackbar/opinion-added-snackbar.component';
import {EmailConfirmationDialogComponent} from '~app/shared/components/email-confirmation-dialog/email-confirmation-dialog.component';
import {RecoveryDialogComponent} from '~app/shared/components/recovery-dialog/recovery-dialog.component';
import {SignInDialogComponent} from '~app/shared/components/sign-in-dialog/sign-in-dialog.component';
import {SignUpDialogComponent} from '~app/shared/components/sign-up-dialog/sign-up-dialog.component';
import {UserService} from '~app/services/user/user.service';
import {MessagesPanelComponent} from '~app/shared/components/messages-panel/messages-panel.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    GraphQLModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    NgxsModule.forRoot([AppState], {
      developmentMode: !environment.production,
      selectorOptions: {
        // These Selector Settings are recommended in preparation for NGXS v4
        suppressErrors: false,
        injectContainerState: false,
      },
      /*
        Set this to true in order to enable support for pages where a Strict Content Security Policy has been enabled.
        This setting circumvent some optimisations that violate a strict CSP through the use of new Function(...)
       */
      // compatibility: {
      //   strictContentSecurityPolicy: true,
      // },
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    // Following modules considered global as they available across the app, mostly because of being used in the header or on multiple pages
    MatSnackBarModule,
    HeaderComponent,
    AddOpinionDialogComponent,
    OpinionAddedSnackbarComponent,
    EmailConfirmationDialogComponent,
    RecoveryDialogComponent,
    SignInDialogComponent,
    SignUpDialogComponent,
    MessagesPanelComponent,
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

        return userService.getUserEssentials(); // It is not crucial to query 'bio' field (little bit of overhead), but I believe it is better to fetch it here to avoid extra query if user profile page is accessed (not a big deal)
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
