import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {CHECK_USER_STATUS} from '~app/graphql/user-status/user-status.queries';
import {CheckUserStatusQueryResult} from '~app/typings/user-status/user-status.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserStatusService {
  public constructor(private readonly apollo: Apollo) {}

  public checkUserStatus(checkMessage: boolean): Observable<ApolloQueryResult<CheckUserStatusQueryResult>> {
    return this.apollo.query<CheckUserStatusQueryResult>({
      query: CHECK_USER_STATUS,
      variables: {checkMessage},
      fetchPolicy: 'no-cache',
    });
  }
}
