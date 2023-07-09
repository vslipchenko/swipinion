import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/user-opinion/user-opinion.interfaces';
import {OpinionType} from '../../typings/opinion/opinion.enums';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {QueryPayload} from '../../typings/query/query.types';

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

export const queryOpinionsByUserId = (
  {parameters, values}: QueryPayload<{edgeId: string; followerId: string}>,
  requestingOwnData: boolean,
): QueryConfig => {
  const olderOpinionsCondition = parameters.edgeId ? 'AND uo.id < ' + parameters.edgeId : '';
  const followsOtherUserCondition = parameters.followerId
    ? `
        OR (
          us.view_opinions = ${PrivacyCommonSettings.FollowersOnly}
          AND uf.follower_id = ${parameters.followerId}
          AND uf.pending = FALSE
        )
      `
    : '';
  const allowedByPrivacySettingsCondition = requestingOwnData
    ? ''
    : `
       AND EXISTS (
        SELECT
          1
        FROM
          user_settings AS us
        LEFT JOIN
          user_followers AS uf ON us.user_id = uf.user_id
        WHERE
          us.user_id = $1
          AND (
            (us.view_opinions = ${PrivacyCommonSettings.Everyone})
            ${followsOtherUserCondition}
          )
          AND uo.user_id = $1
      )
    `;

  return {
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
        uo.user_id = $1
        ${olderOpinionsCondition}
        ${allowedByPrivacySettingsCondition}
      GROUP BY
        uo.id
      ORDER BY
        uo.id DESC
      LIMIT $2
  `,
    values,
  };
};
