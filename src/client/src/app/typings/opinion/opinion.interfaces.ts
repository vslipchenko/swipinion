import {OpinionType} from '~app/typings/opinion/opinion.enums';

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
