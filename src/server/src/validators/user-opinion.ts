import Joi from 'joi';
import {getNumericEnumValues} from '../utilities/enum';
import {CreateOpinion} from '../typings/user-opinion/user-opinion.interfaces';
import {FILE_URL_MAX_LENGTH, MAX_TAG_COUNT, TAG_REGEXP} from '../constants/validation';
import {bigintValidator, usernameValidator} from './shared';
import {OpinionType} from '../typings/opinion/opinion.enums';

export const createOpinionValidator = Joi.object<CreateOpinion>({
  type: Joi.number().valid(...getNumericEnumValues(OpinionType)),
  fileUrl: Joi.string()
    .regex(/^https:\/\/i\.ibb\.co\//) // String starts with; Currently works for ibb uploaded images; Extend once more media types supported
    .max(FILE_URL_MAX_LENGTH)
    .allow(null),
  // title: Joi.string().max(100).allow(null),
  description: Joi.string().trim().max(3000).allow(null),
  tags: Joi.array().items(Joi.string().pattern(TAG_REGEXP)).max(MAX_TAG_COUNT),
});

export const getOpinionsByUsernameValidator = Joi.object<unknown>({
  username: usernameValidator,
  edgeId: bigintValidator,
});
