import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {SuccessResponse} from '~app/typings/response/response.interfaces';

export interface Opinion {
  id: string;
  type: OpinionType;
  file_url: string;
  title: string;
  description: string;
  tags: Array<string>;
}

export interface CreateOpinionMutationResult {
  createOpinion: string;
}

export interface CheckUserStatusQueryResult {
  checkUserStatus: {unreadMessage: boolean; unreadNotification: boolean};
}

export interface DeleteOpinionMutationResult {
  deleteOpinion: SuccessResponse;
}

export interface CreateOpinion {
  type: OpinionType;
  fileUrl: string;
  title: string;
  description: string;
  tags: Array<string>;
}

export interface GetOpinionsByUsernameQueryResult {
  getOpinionsByUsername: Array<Opinion>;
}

export interface GetOpinions {
  username: string;
  offset: number;
}
