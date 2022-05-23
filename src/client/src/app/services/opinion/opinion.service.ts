import {Injectable} from '@angular/core';
import {Apollo, MutationResult} from 'apollo-angular';
import {Observable} from 'rxjs';
import {CREATE_OPINION} from '~app/graphql/opinion/opinion.mutations';
import {CreateOpinion, CreateOpinionMutationResult} from '~app/typings/opinion/opinion.interfaces';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  public constructor(private readonly apollo: Apollo) {}

  public createOpinion(input: CreateOpinion): Observable<MutationResult<CreateOpinionMutationResult>> {
    return this.apollo.mutate<CreateOpinionMutationResult>({
      mutation: CREATE_OPINION,
      variables: {input},
    });
  }
}
