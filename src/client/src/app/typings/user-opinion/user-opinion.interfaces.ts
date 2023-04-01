import {SuccessResponse} from '~app/typings/response/response.interfaces';
import {OpinionType} from '~app/typings/opinion/opinion.enums';

export interface UserOpinion {
  id: string;
  type: OpinionType;
  file_url: string;
  description: string;
  tags: Array<string>;
}

export interface CreateOpinionMutationResult {
  createOpinion: {id: string; type: OpinionType};
}

export interface DeleteOpinionMutationResult {
  deleteOpinion: SuccessResponse;
}

export interface CreateOpinion {
  fileUrl?: string;
  description?: string;
  tags: Array<string>;
}

export interface FetchUserOpinionsPayload {
  username: string;
  edgeId?: string;
  isProfilePath: boolean;
}

export interface GetOpinionsByUsernameQueryResult {
  getOpinionsByUsername: Array<UserOpinion>;
}

export interface GetOpinions {
  username: string;
  edgeId?: string;
}
