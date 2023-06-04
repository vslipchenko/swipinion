import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_GENERAL_OPINIONS} from '~app/graphql/opinion/opinion.queries';
import {
  AddOpinionToFavoritesMutationResult,
  GetGeneralOpinionsQueryResult,
  ReactToOpinion,
  ReactToOpinionMutationResult,
} from '~app/typings/opinion/opinion.interfaces';
import {ADD_OPINION_TO_FAVORITES, REACT_TO_OPINION} from '~app/graphql/opinion/opinion.mutations';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  public constructor(private readonly apollo: Apollo) {}

  public getGeneralOpinions(edgeId?: string): Observable<ApolloQueryResult<GetGeneralOpinionsQueryResult>> {
    return this.apollo.query<GetGeneralOpinionsQueryResult>({
      query: GET_GENERAL_OPINIONS,
      variables: {edgeId},
      fetchPolicy: 'no-cache',
    });
  }

  public reactToOpinion(input: ReactToOpinion): Observable<MutationResult<ReactToOpinionMutationResult>> {
    return this.apollo.mutate<ReactToOpinionMutationResult>({
      mutation: REACT_TO_OPINION,
      variables: {input},
    });
  }

  public addOpinionToFavorites(opinionId: string): Observable<MutationResult<AddOpinionToFavoritesMutationResult>> {
    return this.apollo.mutate<AddOpinionToFavoritesMutationResult>({
      mutation: ADD_OPINION_TO_FAVORITES,
      variables: {opinionId},
    });
  }
}
