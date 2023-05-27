import Joi from 'joi';
import {bigintValidator} from './shared';
import {OPINION_COMMENT_MAX_LENGTH} from '../constants/validation';
import {getNumericEnumValues} from '../utilities/enum';
import {OpinionReaction} from '../typings/opinion/opinion.enums';

export const reactToOpinionValidator = Joi.object({
  opinionId: bigintValidator,
  reaction: Joi.number().valid(...getNumericEnumValues(OpinionReaction)),
  comment: Joi.string().trim().min(1).max(OPINION_COMMENT_MAX_LENGTH).allow(null),
});
