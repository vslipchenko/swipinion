import {QueryConfig} from 'pg';
import {OPINION_FETCH_LIMIT} from '../../constants/opinions';
import {OpinionReaction} from '../../typings/opinion/opinion.enums';

export const queryGeneralOpinionsForAuthorizedUser = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, 
       users.username,
       user_opinions.user_id, 
       user_opinions.type, 
       user_opinions.title, 
       user_opinions.file_url, 
       user_opinions.description, 
       array_agg(tags.tag) AS tags,
       COALESCE(reactions.agreed, 0) AS agreed,
       COALESCE(reactions.disagreed, 0) AS disagreed
    FROM user_opinions
    LEFT JOIN (
      SELECT opinion_id,
        COUNT(CASE WHEN reaction = ${OpinionReaction.Agree} THEN 1 END) AS agreed,
        COUNT(CASE WHEN reaction = ${OpinionReaction.Disagree} THEN 1 END) AS disagreed
      FROM user_opinion_reactions
      GROUP BY opinion_id
    ) AS reactions ON user_opinions.id = reactions.opinion_id
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
    LEFT JOIN users ON user_opinions.user_id = users.id
    WHERE 
      ${edgeId ? 'user_opinions.id < $3 AND' : ''}
      user_opinions.user_id != $1 AND 
      NOT EXISTS (
          SELECT 1 
          FROM user_opinion_reactions 
          WHERE opinion_id = user_opinions.id 
            AND user_id = $1
      )
    GROUP BY user_opinions.id, users.username, reactions.agreed, reactions.disagreed
    ORDER BY user_opinions.id DESC
    LIMIT $2
  `,
  values: edgeId ? [userId, OPINION_FETCH_LIMIT, edgeId] : [userId, OPINION_FETCH_LIMIT],
});

export const queryGeneralOpinionsForUnauthorizedUser = (): QueryConfig => ({
  text: `
     SELECT user_opinions.id, 
       user_opinions.user_id, 
       user_opinions.type, 
       user_opinions.title, 
       user_opinions.file_url, 
       user_opinions.description, 
       array_agg(tags.tag) AS tags,
       reactions.agreed,
	     reactions.disagreed
    FROM user_opinions
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
    LEFT JOIN (
       SELECT opinion_id, 
         COUNT(CASE WHEN reaction = ${OpinionReaction.Agree} THEN 1 END) AS agreed,
         COUNT(CASE WHEN reaction = ${OpinionReaction.Disagree} THEN 1 END) AS disagreed
       FROM user_opinion_reactions 
       GROUP BY opinion_id
    ) reactions ON user_opinions.id = reactions.opinion_id
    GROUP BY user_opinions.id,
      reactions.agreed,
      reactions.disagreed
    ORDER BY user_opinions.id DESC -- Show fresh opinions each time
    LIMIT 2 -- No need for more as there is auth guard that would prevent unauthorized user actions
  `,
});
