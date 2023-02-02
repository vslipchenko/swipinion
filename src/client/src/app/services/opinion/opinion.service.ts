import {Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_GENERAL_OPINIONS} from '~app/graphql/opinion/opinion.queries';
import {GetGeneralOpinionsQueryResult} from '~app/typings/opinion/opinion.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  public constructor(private readonly apollo: Apollo) {}

  public getGeneralOpinions(): Observable<ApolloQueryResult<GetGeneralOpinionsQueryResult>> {
    return this.apollo.query<GetGeneralOpinionsQueryResult>({
      query: GET_GENERAL_OPINIONS,
      fetchPolicy: 'no-cache',
    });
  }
}
