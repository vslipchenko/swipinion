import {SuccessResponse} from '~app/typings/response/response.interfaces';
import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';

export interface UserOpinion {
  id: string;
  type: OpinionType;
  file_url: string;
  body: string;
  tags: Array<string>;
  reaction: OpinionReaction | null;
  commented: boolean;
  agreed: number;
  disagreed: number;
  comments: number;
}

export interface CreateOpinionMutationResult {
  createOpinion: {id: string; type: OpinionType};
}

export interface DeleteOpinionMutationResult {
  deleteOpinion: SuccessResponse;
}

export interface CreateOpinion {
  fileUrl?: string;
  body?: string;
  tags: Array<string>;
}

export interface FetchUserOpinionsPayload {
  userId: string;
  edgeId?: string;
  profileOwner: boolean;
}

export interface GetOpinionsByUserIdQueryResult {
  getOpinionsByUserId: Array<UserOpinion>;
}

export interface GetOpinions {
  userId: string;
  edgeId?: string;
}
