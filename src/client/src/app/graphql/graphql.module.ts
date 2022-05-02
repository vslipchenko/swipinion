import {NgModule} from '@angular/core';
import {APOLLO_OPTIONS, ApolloModule} from 'apollo-angular';
import {ApolloClientOptions, ApolloLink, InMemoryCache} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';
import {environment} from '~environments/environment';
import {onError} from '@apollo/client/link/error';
import {ApolloErrorCode} from '~app/typings/apollo/apollo.enums';

export function apolloClientOptions(httpLink: HttpLink): ApolloClientOptions<unknown> {
  // Suppress errors handled by auth interceptor
  // https://apollo-angular.com/docs/1.0/features/error-handling/#ignoring-errors
  const error = onError(({response}) => {
    if (response?.errors) {
      for (let i = 0; i < response.errors.length; i++) {
        switch (response.errors[i].extensions['code']) {
          case ApolloErrorCode.EmptyAccessToken:
          case ApolloErrorCode.ExpiredAccessToken:
          case ApolloErrorCode.InvalidAccessToken:
          case ApolloErrorCode.InvalidRefreshToken:
          case ApolloErrorCode.EmptyRefreshToken:
          case ApolloErrorCode.BlockedUser:
            (response.errors as any).splice(i, 1); // Remove error from list
        }
      }
    }
  });

  const link = httpLink.create({uri: `//${environment.api.host}:${environment.api.port}/graphql`});
  // const link = httpLink.create({uri: `//${environment.api.host}/graphql`});

  return {
    link: ApolloLink.from([error, link]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: apolloClientOptions,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
