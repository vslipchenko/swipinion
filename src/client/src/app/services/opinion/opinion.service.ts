import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {ApolloQueryResult} from '@apollo/client/core';
import {GET_GENERAL_OPINIONS} from '~app/graphql/opinion/opinion.queries';
import {CommentOpinion, GetGeneralOpinionsQueryResult} from '~app/typings/opinion/opinion.interfaces';
import {COMMENT_OPINION} from '~app/graphql/opinion/opinion.mutations';
import {SuccessResponse} from '~app/typings/response/response.interfaces';

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

  public commentOpinion(input: CommentOpinion): Observable<MutationResult<SuccessResponse>> {
    return this.apollo.mutate<SuccessResponse>({
      mutation: COMMENT_OPINION,
      variables: {input},
    });
  }
}
