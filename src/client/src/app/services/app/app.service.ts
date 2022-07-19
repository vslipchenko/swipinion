import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_SERVER_TIMESTAMP} from '~app/graphql/app/app.queries';
import {GetServerTimestampQueryResult} from '~app/typings/app/app.interfaces';
import {Store} from '@ngxs/store';
import {UpdateUtcTimestamp} from '~app/modules/app/store/app.actions';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public constructor(private readonly apollo: Apollo, private readonly store: Store) {
    setInterval(() => {
      this.store.dispatch(new UpdateUtcTimestamp(this.store.selectSnapshot(AppSelectors.utcTimestamp) + 60000));
    }, 60000); // Trigger utc timestamp update each minute
  }

  public getServerTimestamp(): Observable<ApolloQueryResult<GetServerTimestampQueryResult>> {
    return this.apollo.query<GetServerTimestampQueryResult>({
      query: GET_SERVER_TIMESTAMP,
    });
  }
}
