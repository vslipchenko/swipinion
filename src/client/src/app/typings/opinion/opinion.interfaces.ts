import {OpinionType} from '~app/typings/opinion/opinion.enums';

export interface Opinion {
  id: number;
  type: OpinionType;
  fileUrl: string;
  title: string;
  description: string;
  tags: Array<string>;
}

export interface CreateOpinionMutationResult {
  createOpinion: string;
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
