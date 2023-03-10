import {QueryConfig} from 'pg';
import {OPINION_FETCH_LIMIT} from '../../constants/opinions';
import {OpinionReaction} from '../../typings/opinion/opinion.enums';

export const queryGeneralOpinionsForAuthorizedUser = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, 
      user_opinions.user_id, 
      user_opinions.type, 
      user_opinions.title, 
      user_opinions.file_url, 
      user_opinions.description, 
      array_agg(tags.tag) AS tags,
      (SELECT COUNT(*) FROM user_opinion_reactions WHERE opinion_id = user_opinions.id AND reaction = ${
        OpinionReaction.Agree
      }) AS agreed, -- Count how many users agreed
      (SELECT COUNT(*) FROM user_opinion_reactions WHERE opinion_id = user_opinions.id AND reaction = ${
        OpinionReaction.Disagree
      }) AS disagreed -- Count how many users disagreed
    FROM user_opinions
    LEFT JOIN user_opinion_reactions ON user_opinions.id = user_opinion_reactions.opinion_id 
      AND user_opinion_reactions.user_id = $1 -- Dont show opinions user has reacted on (1)
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id -- Get associated tags
    WHERE 
      ${edgeId ? 'user_opinions.id > $3 AND' : ''}
      user_opinions.user_id != $1 AND -- Dont show user's own opinions
      user_opinion_reactions.opinion_id IS NULL -- Dont show opinions user has reacted on (2)
    GROUP BY user_opinions.id
    ORDER BY user_opinions.id
    LIMIT $2
  `,
  values: edgeId ? [userId, OPINION_FETCH_LIMIT, edgeId] : [userId, OPINION_FETCH_LIMIT],
});

export const queryGeneralOpinionsForUnauthorizedUser = (edgeId?: string): QueryConfig => ({
  text: `
     SELECT user_opinions.id, 
       user_opinions.user_id, 
       user_opinions.type, 
       user_opinions.title, 
       user_opinions.file_url, 
       user_opinions.description, 
       array_agg(tags.tag) AS tags,
       (SELECT COUNT(*) FROM user_opinion_reactions WHERE opinion_id = user_opinions.id AND reaction = ${
         OpinionReaction.Agree
       }) AS agreed, -- Count how many users agreed
       (SELECT COUNT(*) FROM user_opinion_reactions WHERE opinion_id = user_opinions.id AND reaction = ${
         OpinionReaction.Disagree
       }) AS disagreed -- Count how many users disagreed
    FROM user_opinions
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
    ${edgeId ? 'WHERE user_opinions.id > $1' : ''}
    GROUP BY user_opinions.id
    ORDER BY user_opinions.id
    LIMIT 1 -- No need to count more as there is auth guard that would prevent unauthorized user actions
  `, // Consider to limit to 2, use second one as background in case of any offset effects on swipe
  values: edgeId ? [edgeId] : [],
});
