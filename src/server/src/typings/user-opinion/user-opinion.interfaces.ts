import {OpinionType} from './user-opinion.enums';

export interface CreateOpinion {
  type: OpinionType;
  fileUrl: string;
  title: string;
  description: string;
  tags: Array<string>;
}
