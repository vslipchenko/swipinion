import {OpinionType} from '../opinion/opinion.enums';

export interface CreateOpinion {
  type: OpinionType;
  fileUrl: string;
  title: string;
  description: string;
  tags: Array<string>;
}
