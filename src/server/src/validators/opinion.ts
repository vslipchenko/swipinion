import Joi from 'joi';
import {OpinionType} from '../typings/opinion/opinion.enums';
import {getNumericEnumValues} from '../utilities/enum';
import {CreateOpinion} from '../typings/opinion/opinion.interfaces';
import {TAG_REGEXP, FILE_URL_MAX_LENGTH, MAX_TAG_COUNT} from '../constants/validation';

export const createOpinionValidator = Joi.object<CreateOpinion>({
  type: Joi.number().valid(...getNumericEnumValues(OpinionType)),
  fileUrl: Joi.string().max(FILE_URL_MAX_LENGTH).allow(null),
  title: Joi.string().max(100).allow(null),
  description: Joi.string().max(3000),
  tags: Joi.array().items(Joi.string().pattern(TAG_REGEXP)).max(MAX_TAG_COUNT),
});
