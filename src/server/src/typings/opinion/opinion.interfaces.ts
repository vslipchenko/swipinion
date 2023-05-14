import {OpinionReaction} from './opinion.enums';

export interface CommentOpinion {
  opinionId: string;
  reaction: OpinionReaction;
  comment: string;
}