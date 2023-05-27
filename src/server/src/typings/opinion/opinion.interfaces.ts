import {OpinionReaction} from './opinion.enums';

export interface ReactToOpinion {
  opinionId: string;
  reaction: OpinionReaction;
  comment: string | null;
}
