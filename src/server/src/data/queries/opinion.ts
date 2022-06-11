import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/opinion/opinion.interfaces';

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
      INSERT INTO opinions
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
    INSERT INTO opinions
    (user_id, type, file_url, title, description)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING id
  `,
  values: [userId, type, fileUrl, title, description],
});

export const queryOpinionsByUsername = (username: string, offset: number): QueryConfig => ({
  text: `
    SELECT id, type, file_url, title, description
    FROM opinions
    WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 10
      OFFSET $2
  `,
  values: [username, offset],
});
