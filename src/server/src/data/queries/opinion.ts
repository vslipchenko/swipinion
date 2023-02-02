import {QueryConfig} from 'pg';

export const queryGeneralOpinionsForAuthorizedUser = (userId: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, user_opinions.user_id, user_opinions.type,  user_opinions.title, user_opinions.file_url, user_opinions.description
    FROM user_opinions
    LEFT JOIN user_opinion_reactions ON user_opinion_reactions.opinion_id = user_opinions.id
    WHERE user_opinions.user_id != $1 AND (user_opinion_reactions.user_id = $1 AND  user_opinion_reactions.opinion_id != user_opinions.id)
  `,
  values: [userId],
});

export const queryGeneralOpinionsForUnauthorizedUser = (): QueryConfig => ({
  text: `
    SELECT id, user_id, type, title, file_url, description
    FROM user_opinions
  `,
});
