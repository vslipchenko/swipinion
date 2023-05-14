import Joi from 'joi';
import {CreateOpinion} from '../typings/user-opinion/user-opinion.interfaces';
import {FILE_URL_MAX_LENGTH, MAX_TAG_COUNT, OPINION_BODY_MAX_LENGTH, TAG_REGEXP} from '../constants/validation';
import {bigintValidator, usernameValidator} from './shared';

export const createOpinionValidator = Joi.object<CreateOpinion>({
  // type: Joi.number().valid(...getNumericEnumValues(OpinionType)),
  fileUrl: Joi.string()
    .regex(/^https:\/\/i\.ibb\.co\//) // String starts with; Currently works for ibb uploaded images; Extend once more media types supported
    .max(FILE_URL_MAX_LENGTH)
    .allow(null),
  // title: Joi.string().max(100).allow(null),
  body: Joi.string().trim().max(OPINION_BODY_MAX_LENGTH).allow(null),
  tags: Joi.array().items(Joi.string().pattern(TAG_REGEXP)).max(MAX_TAG_COUNT),
});

export const getOpinionsByUsernameValidator = Joi.object<unknown>({
  username: usernameValidator,
  edgeId: bigintValidator,
});
