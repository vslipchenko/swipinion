import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HTTP_INTERCEPTORS,
  HttpResponse,
} from '@angular/common/http';
import {finalize, first, Observable, of, Subject, switchMap} from 'rxjs';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {GraphQLError} from 'graphql';
import {Router} from '@angular/router';
import {IMGBB_API} from '~app/constants/imgbb';
import {AuthenticationErrorCode} from '~app/typings/authentication/authentication.enums';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private readonly externalApis = [IMGBB_API];
  private readonly freshAccessToken$ = new Subject<string>();
  private refreshingAccessToken = false;

  public constructor(private readonly authenticationService: AuthenticationService, private readonly router: Router) {}

  private static attachAccessToken(request: HttpRequest<unknown>, accessToken: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const isExternalApiCall = this.externalApis.some((endpoint) => request.url.indexOf(endpoint) > -1);

    if (isExternalApiCall) return next.handle(request); // Pass forward

    const token = this.authenticationService.accessToken$.value;

    if (token) {
      // If we have a token, we set it to the header
      request = AuthenticationInterceptor.attachAccessToken(request, token);
    }

    return next.handle(request).pipe(
      switchMap((response) => {
        if (response instanceof HttpResponse && response.body.errors) {
          const code = (response.body.errors as ReadonlyArray<GraphQLError>)[0].extensions['code'];

          switch (code) {
            case AuthenticationErrorCode.EmptyAccessToken:
            case AuthenticationErrorCode.ExpiredAccessToken: {
              // If refresh is in progress return subject that completes once access toke is received & request is fulfilled
              if (this.refreshingAccessToken) {
                return this.freshAccessToken$.pipe(
                  first((value) => Boolean(value)),
                  switchMap((accessToken) => {
                    return next.handle(AuthenticationInterceptor.attachAccessToken(request, accessToken));
                  }),
                );
              }

              const refreshToken = this.authenticationService.getRefreshToken();

              if (!refreshToken) {
                void this.router.navigate(['/']);
                return of(response);
              }

              this.refreshingAccessToken = true;

              return this.authenticationService.refreshAccessToken().pipe(
                switchMap(({data}) => {
                  this.freshAccessToken$.next(data.refreshAccessToken);
                  return next.handle(AuthenticationInterceptor.attachAccessToken(request, data.refreshAccessToken));
                }),
                finalize(() => {
                  this.refreshingAccessToken = false;
                }),
              );
            }
            case AuthenticationErrorCode.InvalidAccessToken:
            case AuthenticationErrorCode.InvalidRefreshToken:
            case AuthenticationErrorCode.EmptyRefreshToken:
            case AuthenticationErrorCode.BlockedUser:
              this.authenticationService.resetTokens();
              void this.router.navigate(['/']); // TODO replace with sign-in specific route

              return of(response);
          }
        }

        return of(response);
      }),
    );
  }
}

export const AuthenticationInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthenticationInterceptor,
  multi: true,
};
