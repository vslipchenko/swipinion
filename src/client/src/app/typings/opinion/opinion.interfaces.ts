import {OpinionType} from '~app/typings/opinion/opinion.enums';

export interface Opinion {
  id: string;
  user_id: string;
  type: OpinionType;
  file_url: string;
  title: string;
  description: string;
  tags: Array<string>;
}

export interface GetGeneralOpinionsQueryResult {
  getGeneralOpinions: Array<Opinion>;
}
