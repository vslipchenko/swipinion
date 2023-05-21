import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/user-opinion/user-opinion.interfaces';
import {OpinionType} from '../../typings/opinion/opinion.enums';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';

export const concatenateTagValues = (values: Array<string>): string => {
  return values.map((value) => `('${value}', (SELECT id FROM opinion))`).join();
};

export const queryOpinionCreateWithTags = ({
  userId,
  type,
  fileUrl,
  body,
}: CreateOpinion & {type: OpinionType; userId: string}): QueryConfig => ({
  text: `
    WITH opinion AS (
      INSERT INTO user_opinions
      (user_id, type, file_url, body)
      VALUES ($1, $2, $3, $4)
      RETURNING id
    )
    INSERT INTO tags
    (tag, opinion_id)
    VALUES {{values}}
    RETURNING (SELECT id FROM opinion)
  `,
  values: [userId, type, fileUrl, body],
});

export const queryOpinionCreate = ({
  userId,
  type,
  fileUrl,
  body,
}: CreateOpinion & {type: OpinionType; userId: string}): QueryConfig => ({
  text: `
    INSERT INTO user_opinions
    (user_id, type, file_url, body)
    VALUES ($1, $2, $3, $4)
    RETURNING id
  `,
  values: [userId, type, fileUrl, body],
});

export const queryOpinionDelete = (userId: string, opinionId: string): QueryConfig => ({
  text: `
    DELETE FROM user_opinions
    WHERE user_id = $1 AND id = $2
  `,
  values: [userId, opinionId],
});

export const queryOpinionsByUsername = ({
  parametersPlaceholderMap,
  values,
}: {
  parametersPlaceholderMap: {edgeId: string | null; followerId: string | null};
  values: Array<unknown>;
}): QueryConfig => ({
  text: `
    SELECT
      uo.id,
      uo.type,
      uo.file_url,
      uo.body,
      array_agg(t.tag) AS tags
    FROM
      user_opinions AS uo
    LEFT JOIN
      tags AS t ON uo.id = t.opinion_id
    WHERE
      ${parametersPlaceholderMap.edgeId ? 'uo.id < ' + parametersPlaceholderMap.edgeId + ' AND' : ''}
      EXISTS (
        SELECT
          1
        FROM
          users AS u
        LEFT JOIN
          user_settings AS us ON u.id = us.user_id
        LEFT JOIN
          user_followers AS uf ON u.id = uf.user_id
        WHERE
          u.username = $1
          AND (
            (us.view_opinions = ${PrivacyCommonSettings.Everyone})
            ${
              parametersPlaceholderMap.followerId
                ? 'OR (us.view_opinions = ' +
                  PrivacyCommonSettings.FollowersOnly +
                  ' AND uf.follower_id = ' +
                  parametersPlaceholderMap.followerId +
                  ' AND uf.pending = FALSE)'
                : ''
            }
          )
          AND u.id = uo.user_id
      )
    GROUP BY
      uo.id
    ORDER BY
      uo.id DESC
    LIMIT $2
  `,
  values,
});
