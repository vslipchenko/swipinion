import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {OpinionCardSlideDirection, OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Store} from '@ngxs/store';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  public readonly swipeReaction$ = new Subject<{
    reaction: OpinionReaction;
    slideDirection: OpinionCardSlideDirection;
  }>();

  public constructor(private readonly store: Store) {}

  // Helps to prevent user actions while processing current (ongoing) reaction
  public get reactionInProgress(): boolean {
    return this.store.selectSnapshot(OpinionsSelectors.reactionInProgress);
  }
}
