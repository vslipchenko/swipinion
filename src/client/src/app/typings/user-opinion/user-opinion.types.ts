import {UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {OpinionStatistic} from '~app/typings/opinion/opinion.interfaces';

export type UIUserOpinion = UserOpinion & OpinionStatistic & {favorite: boolean};
