import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CREATE_USER} from '~app/graphql/user/user.mutations';
import {ApolloQueryResult} from '@apollo/client/core';
import {USER_WITH_EMAIL_EXISTS, USER_WITH_USERNAME_EXISTS} from '~app/graphql/user/user.queries';
import {
  CreateUser,
  CreateUserMutationResult,
  UserWithEmailExistsQueryResult,
  UserWithUsernameExistsQueryResult,
} from '~app/typings/user/user.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  public constructor(private readonly apollo: Apollo) {}

  public create(input: CreateUser): Observable<MutationResult<CreateUserMutationResult>> {
    return this.apollo.mutate<CreateUserMutationResult>({
      mutation: CREATE_USER,
      variables: {input},
      fetchPolicy: 'network-only',
    });
  }

  public checkExistenceByUsername(username: string): Observable<ApolloQueryResult<UserWithUsernameExistsQueryResult>> {
    return this.apollo.query<UserWithUsernameExistsQueryResult>({
      query: USER_WITH_USERNAME_EXISTS,
      variables: {username},
    });
  }

  public checkExistenceByEmail(email: string): Observable<ApolloQueryResult<UserWithEmailExistsQueryResult>> {
    return this.apollo.query<UserWithEmailExistsQueryResult>({
      query: USER_WITH_EMAIL_EXISTS,
      variables: {email},
    });
  }
}
