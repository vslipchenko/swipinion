import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';

export interface Opinion {
  id: string;
  user_id: string;
  username: string;
  type: OpinionType;
  file_url: string;
  // title: string;
  body: string;
  agreed: string;
  disagreed: string;
  comments: string;
  tags: Array<string>;
}

export interface GetGeneralOpinionsQueryResult {
  getGeneralOpinions: Array<Opinion>;
}

export interface CommentOpinion {
  opinionId: string;
  reaction: OpinionReaction;
  comment: string;
}
