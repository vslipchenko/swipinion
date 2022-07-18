import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_SERVER_TIMESTAMP} from '~app/graphql/app/app.queries';
import {GetServerTimestampQueryResult} from '~app/typings/app/app.interfaces';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public constructor(private readonly apollo: Apollo) {}

  public getServerTimestamp(): Observable<ApolloQueryResult<GetServerTimestampQueryResult>> {
    return this.apollo.query<GetServerTimestampQueryResult>({
      query: GET_SERVER_TIMESTAMP,
    });
  }
}
