import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CREATE_OPINION, DELETE_OPINION} from '~app/graphql/user-opinion/user-opinion.mutations';
import {
  CreateOpinion,
  CreateOpinionMutationResult,
  DeleteOpinionMutationResult,
  GetOpinions,
  GetOpinionsByUserIdQueryResult,
} from '~app/typings/user-opinion/user-opinion.interfaces';
import {GET_OPINIONS_BY_USER_ID} from '~app/graphql/user-opinion/user-opinion.queries';
import {ApolloQueryResult} from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class UserOpinionService {
  public constructor(private readonly apollo: Apollo) {}

  public createOpinion(input: CreateOpinion): Observable<MutationResult<CreateOpinionMutationResult>> {
    return this.apollo.mutate<CreateOpinionMutationResult>({
      mutation: CREATE_OPINION,
      variables: {input},
    });
  }

  public deleteOpinion(opinionId: string): Observable<MutationResult<DeleteOpinionMutationResult>> {
    return this.apollo.mutate<DeleteOpinionMutationResult>({
      mutation: DELETE_OPINION,
      variables: {opinionId},
    });
  }

  public getOpinionsByUserId(input: GetOpinions): Observable<ApolloQueryResult<GetOpinionsByUserIdQueryResult>> {
    return this.apollo.query<GetOpinionsByUserIdQueryResult>({
      query: GET_OPINIONS_BY_USER_ID,
      variables: {input},
      fetchPolicy: 'no-cache', // TODO add and fix caching of the profile opinions
    });
  }
}
