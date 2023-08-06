import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';
import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface Opinion {
  id: string;
  user_id: string;
  username: string;
  thumbnail: string;
  type: OpinionType;
  file_url: string;
  // title: string;
  body: string;
  agreed: number;
  disagreed: number;
  comments: number;
  tags: Array<string>;
}

export interface GetGeneralOpinionsQueryResult {
  getGeneralOpinions: Array<Opinion>;
}

export interface ReactToOpinion {
  opinionId: string;
  reaction: OpinionReaction;
  comment: string | null;
}

export interface ReactToOpinionMutationResult {
  reactToOpinion: SuccessResponse;
}

export interface AddOpinionToFavoritesMutationResult {
  addOpinionToFavorites: SuccessResponse;
}

export interface RemoveOpinionFromFavoritesMutationResult {
  removeOpinionFromFavorites: SuccessResponse;
}

export interface OpinionStatistic {
  formattedAgreed: string;
  formattedDisagreed: string;
  formattedComments: string;
}
