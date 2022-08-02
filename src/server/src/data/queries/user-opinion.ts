import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/opinion/opinion.interfaces';
import {OPINION_FETCH_LIMIT} from '../../constants/opinions';

export const concatenateTagValues = (values: Array<string>): string => {
  return values.map((value) => `('${value}', (SELECT id FROM opinion))`).join(', ');
};

export const queryOpinionCreateWithTags = ({
  userId,
  type,
  fileUrl,
  title,
  description,
}: CreateOpinion & {userId: string}): QueryConfig => ({
  text: `
    WITH opinion AS (
      INSERT INTO user_opinions
      (user_id, type, file_url, title, description)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING id
    )
    INSERT INTO tags
    (tag, opinion_id)
    VALUES {{values}}
    RETURNING (SELECT id FROM opinion)
  `,
  values: [userId, type, fileUrl, title, description],
});

export const queryOpinionCreate = ({
  userId,
  type,
  fileUrl,
  title,
  description,
}: CreateOpinion & {userId: string}): QueryConfig => ({
  text: `
    INSERT INTO user_opinions
    (user_id, type, file_url, title, description)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id
  `,
  values: [userId, type, fileUrl, title, description],
});

export const queryOpinionDelete = (userId: string, opinionId: string): QueryConfig => ({
  text: `
    DELETE FROM user_opinions
    WHERE user_id = $1 AND id = $2
  `,
  values: [userId, opinionId],
});

export const queryOpinionsByUsername = (username: string, offset: number): QueryConfig => ({
  text: `
    SELECT user_opinions.id, 
        user_opinions.type, 
        user_opinions.file_url, 
        user_opinions.title, 
        user_opinions.description, 
        array_agg(tags.tag) as tags
    FROM user_opinions
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
      WHERE user_opinions.user_id = (SELECT id FROM users WHERE username = $1)
      GROUP BY user_opinions.id
      ORDER BY user_opinions.created_at DESC
      LIMIT $3
      OFFSET $2
  `,
  values: [username, offset, OPINION_FETCH_LIMIT],
});
