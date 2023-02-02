import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CREATE_OPINION, DELETE_OPINION} from '~app/graphql/user-opinion/user-opinion.mutations';
import {
  CreateOpinion,
  CreateOpinionMutationResult,
  DeleteOpinionMutationResult,
  GetOpinions,
  GetOpinionsByUsernameQueryResult,
} from '~app/typings/opinion/opinion.interfaces';
import {GET_OPINIONS_BY_USERNAME} from '~app/graphql/user-opinion/user-opinion.queries';
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

  public getOpinionsByUsername(input: GetOpinions): Observable<ApolloQueryResult<GetOpinionsByUsernameQueryResult>> {
    return this.apollo.query<GetOpinionsByUsernameQueryResult>({
      query: GET_OPINIONS_BY_USERNAME,
      variables: {input},
      fetchPolicy: 'no-cache', // TODO add and fix caching of the profile opinions
    });
  }
}
