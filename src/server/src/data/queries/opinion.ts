import {QueryConfig} from 'pg';
import {OPINION_FETCH_LIMIT} from '../../constants/opinions';

export const queryGeneralOpinionsForAuthorizedUser = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, user_opinions.user_id, user_opinions.type,  user_opinions.title, user_opinions.file_url, user_opinions.description
    FROM user_opinions
    LEFT JOIN user_opinion_reactions ON user_opinion_reactions.opinion_id = user_opinions.id
    WHERE 
        ${edgeId ? 'user_opinions.id > $3 AND' : ''}
        user_opinions.user_id != $1 AND 
        (user_opinion_reactions.user_id = $1 AND  user_opinion_reactions.opinion_id != user_opinions.id)
    LIMIT $2
  `,
  values: edgeId ? [userId, OPINION_FETCH_LIMIT, edgeId] : [userId, OPINION_FETCH_LIMIT],
});

export const queryGeneralOpinionsForUnauthorizedUser = (edgeId?: string): QueryConfig => ({
  text: `
    SELECT id, user_id, type, title, file_url, description
    FROM user_opinions
    ${edgeId ? 'WHERE id > $2' : ''}
    LIMIT $1
  `,
  values: edgeId ? [OPINION_FETCH_LIMIT, edgeId] : [OPINION_FETCH_LIMIT],
});
