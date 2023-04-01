import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/user-opinion/user-opinion.interfaces';
import {USER_OPINION_FETCH_LIMIT} from '../../constants/opinions';
import {OpinionType} from '../../typings/opinion/opinion.enums';

export const concatenateTagValues = (values: Array<string>): string => {
  return values.map((value) => `('${value}', (SELECT id FROM opinion))`).join();
};

export const queryOpinionCreateWithTags = ({
  userId,
  type,
  fileUrl,
  description,
}: CreateOpinion & {type: OpinionType; userId: string}): QueryConfig => ({
  text: `
    WITH opinion AS (
      INSERT INTO user_opinions
      (user_id, type, file_url, description)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    )
    INSERT INTO tags
    (tag, opinion_id)
    VALUES {{values}}
    RETURNING (SELECT id FROM opinion)
  `,
  values: [userId, type, fileUrl, description],
});

export const queryOpinionCreate = ({
  userId,
  type,
  fileUrl,
  description,
}: CreateOpinion & {type: OpinionType; userId: string}): QueryConfig => ({
  text: `
    INSERT INTO user_opinions
    (user_id, type, file_url, description)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `,
  values: [userId, type, fileUrl, description],
});

export const queryOpinionDelete = (userId: string, opinionId: string): QueryConfig => ({
  text: `
    DELETE FROM user_opinions
    WHERE user_id = $1 AND id = $2
  `,
  values: [userId, opinionId],
});

export const queryOpinionsByUsername = (username: string, edgeId: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, 
        user_opinions.type, 
        user_opinions.file_url,
        user_opinions.description, 
        array_agg(tags.tag) as tags
    FROM user_opinions
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
      WHERE user_opinions.user_id = (SELECT id FROM users WHERE username = $1) ${
        edgeId ? 'AND user_opinions.id < $3' : ''
      }
      GROUP BY user_opinions.id
      ORDER BY user_opinions.id DESC
      LIMIT $2
  `,
  values: edgeId ? [username, USER_OPINION_FETCH_LIMIT, edgeId] : [username, USER_OPINION_FETCH_LIMIT],
});
