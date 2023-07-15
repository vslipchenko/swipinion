import {QueryConfig} from 'pg';
import {CreateOpinion} from '../../typings/user-opinion/user-opinion.interfaces';
import {OpinionReaction, OpinionType} from '../../typings/opinion/opinion.enums';
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
  // requestingOwnData used to differentiate whether user is requesting own or other user's data,
  // but parameters.followerId rather used for checking requester authed or not because requestingOwnData,
  // can be falsy but this does not mean user is not authed
  requestingOwnData: boolean,
): QueryConfig => {
  const selectFields = `
    uo.id,
    uo.type,
    uo.file_url,
    uo.body,
    COALESCE(rs.agreed, 0) AS agreed,
    COALESCE(rs.disagreed, 0) AS disagreed,
    COALESCE(rs.comments, 0) AS comments,
    ${parameters.followerId ? 'r.reaction, COALESCE(r.commented, false) AS commented,' : ''}
    array_agg(t.tag) AS tags
  `;

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
      EXISTS (
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
      ) AND
    `;

  const requesterHasReactedToOpinion = parameters.followerId
    ? `
      LEFT JOIN (
        SELECT opinion_id,
          reaction,
          comment IS NOT NULL AS commented
        FROM user_opinion_reactions
        WHERE user_id = ${parameters.followerId}
      ) AS r ON uo.id = r.opinion_id
    `
    : '';

  const groupByFields = `
    uo.id,
    ${parameters.followerId ? 'r.reaction, r.commented,' : ''}
    rs.agreed,
    rs.disagreed,
    rs.comments
  `;

  return {
    text: `
      SELECT
        ${selectFields}
      FROM
        user_opinions AS uo
      LEFT JOIN
        tags AS t ON uo.id = t.opinion_id
      LEFT JOIN (
        SELECT opinion_id,
          COUNT(CASE WHEN reaction = ${OpinionReaction.Agree} THEN 1 END) AS agreed,
          COUNT(CASE WHEN reaction = ${OpinionReaction.Disagree} THEN 1 END) AS disagreed,
          COUNT(CASE WHEN comment IS NOT NULL THEN 1 END) AS comments
        FROM user_opinion_reactions
        GROUP BY opinion_id
      ) AS rs ON uo.id = rs.opinion_id -- Query reaction statistic
      ${requesterHasReactedToOpinion}
      WHERE
        ${allowedByPrivacySettingsCondition}
        uo.user_id = $1
        ${olderOpinionsCondition}
      GROUP BY
        ${groupByFields}
      ORDER BY
        uo.id DESC
      LIMIT $2
  `,
    values,
  };
};
