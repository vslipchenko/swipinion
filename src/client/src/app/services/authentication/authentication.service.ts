import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
  AccessTokenByRefreshTokenQueryResult,
  SignIn,
  SignInQueryResult,
} from '~app/typings/authentication/authentication.interfaces';
import {BehaviorSubject, map, Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {REFRESH_ACCESS_TOKEN, SIGN_IN} from '~app/graphql/authentication/authentication.queries';

// import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  public accessToken$ = new BehaviorSubject('');

  public constructor(private readonly apollo: Apollo) {
  }

  public signIn(input: SignIn): Observable<ApolloQueryResult<SignInQueryResult>> {
    return this.apollo.query<SignInQueryResult>({
      query: SIGN_IN,
      variables: {input},
      fetchPolicy: 'network-only',
    });
  }

  public refreshAccessToken(): Observable<ApolloQueryResult<AccessTokenByRefreshTokenQueryResult>> {
    return this.apollo.query<AccessTokenByRefreshTokenQueryResult>({
      query: REFRESH_ACCESS_TOKEN,
      variables: {refreshToken: this.getRefreshToken()},
      fetchPolicy: 'network-only',
    });
  }

  // public getAccessTokenData(): AccessTokenData {
  //   const accessToken = this.accessToken$.value;
  //   return accessToken ? jwt_decode(accessToken) : ({} as AccessTokenData);
  // }

  public getRefreshToken(): string | null {
    return sessionStorage.getItem('token') || localStorage.getItem('token');
  }

  public setRefreshToken(token: string, session: boolean): void {
    if (session) return sessionStorage.setItem('token', token);
    localStorage.setItem('token', token);
  }

  public resetTokens(): void {
    this.accessToken$.next('');
    sessionStorage.removeItem('token');
    localStorage.removeItem('token');
  }

  public get authenticated$(): Observable<boolean> {
    return this.accessToken$.asObservable().pipe(map((token) => Boolean(token)));
  }

  // public logout(): void {
  //   this.resetTokens();
  //   // This will reset app's state & redirect to sign-in page if protected route is requested
  //   // window.location.reload(); // TODO review whether its necessary
  // }

  public get authenticated(): boolean {
    return Boolean(this.accessToken$.value);
  }
}
