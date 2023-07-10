import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {QueryPayload} from '../../typings/query/query.types';

export const queryFavoritesByUserId = (
  {parameters, values}: QueryPayload<{followerId: string; edgeId: string}>,
  requestingOwnData: boolean,
): QueryConfig => {
  const olderOpinionsCondition = parameters.edgeId ? 'AND uo.id < ' + parameters.edgeId : '';

  const requesterCanViewUserFavoritesCondition = requestingOwnData
    ? ''
    : `
      AND EXISTS (
        SELECT 1 
        FROM user_settings AS us
        WHERE user_id = $1 
          AND view_favorites = ${PrivacyCommonSettings.Everyone}
          ${
            parameters.followerId
              ? `
               OR (
                  us.view_favorites = ${PrivacyCommonSettings.FollowersOnly}
                  AND uf.follower_id = ${parameters.followerId}
                  AND uf.pending = FALSE
                )
            `
              : ''
          }
      )
    `;

  const requesterCanViewOpinionsOfOthersCondition = `
      AND (
        ${
          requestingOwnData ? 'uo.user_id = $1 OR' : ''
        } -- Skip privacy check if requesting own favorites and owns favorite opinion 
        us.view_opinions = ${PrivacyCommonSettings.Everyone} 
        OR (us.view_opinions = ${PrivacyCommonSettings.FollowersOnly} 
            AND uf.follower_id = $1 
            AND uf.pending = FALSE
        )
      )
    `;

  return {
    text: `
      SELECT
        ufo.id,
        uor.reaction,
        uor.comment IS NOT NULL AS commented,
        uo.id AS opinion_id,
        uo.user_id,
        uo.type,
        uo.file_url,
        uo.body,
        array_agg(t.tag) AS tags
      FROM
        user_opinions AS uo
      LEFT JOIN
        user_favorite_opinions AS ufo ON uo.id = ufo.opinion_id
      LEFT JOIN
        user_opinion_reactions AS uor ON uo.id = uor.opinion_id AND uor.user_id = $1 -- Check whether user has reacted to opinions
      LEFT JOIN
        tags AS t ON uo.id = t.opinion_id
      LEFT JOIN user_settings AS us ON us.user_id = uo.user_id
      LEFT JOIN user_followers AS uf ON uf.user_id = uo.user_id
      WHERE
        ufo.user_id = $1
        ${requesterCanViewUserFavoritesCondition}
        ${olderOpinionsCondition}
        ${requesterCanViewOpinionsOfOthersCondition}
      GROUP BY
        ufo.id, uo.id, uor.reaction, uor.comment
      ORDER BY
        uo.id DESC
      LIMIT $2
    `,
    values,
  };
};
