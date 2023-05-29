import {Opinion} from '~app/typings/opinion/opinion.interfaces';

export type CarouselOpinion = Opinion & {
  formattedAgreed: string;
  formattedDisagreed: string;
  formattedComments: string;
};
