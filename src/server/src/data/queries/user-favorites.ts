import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {QueryPayload} from '../../typings/query/query.types';
// TODO query by user id
export const queryFavoritesByUsername = ({
  parameters,
  values,
}: QueryPayload<{followerId: string; edgeId: string}>): QueryConfig => ({
  text: `
    WITH user_id AS (
      SELECT id FROM users WHERE username = $1 -- Use CTE to prevent multiple lookups
    )
    SELECT
      ufo.id AS favorites_id,
      uor.reaction,
      uor.comment IS NOT NULL AS commented,
      uo.id,
      uo.type,
      uo.file_url,
      uo.body,
      array_agg(t.tag) AS tags
    FROM
      user_opinions AS uo
    JOIN                                       -- Helps to avoid boilerplate SELECT id FROM user_id queries
      user_id AS uid ON true
    LEFT JOIN
      user_favorite_opinions AS ufo ON uo.id = ufo.opinion_id
    LEFT JOIN
      user_opinion_reactions AS uor ON uo.id = uor.opinion_id AND uor.user_id = uid.id -- Check whether user has reacted to opinions
    LEFT JOIN
      tags AS t ON uo.id = t.opinion_id
    WHERE
      ufo.user_id = uid.id AND
      ${parameters.edgeId ? 'ufo.id < ' + parameters.edgeId + ' AND' : ''}
      EXISTS ( -- Check user has rights to view opinions as some user may have strict privacy settings
        SELECT
          1
        FROM
          users AS u
        LEFT JOIN
          user_settings AS us ON u.id = us.user_id
        LEFT JOIN
          user_followers AS uf ON u.id = uf.user_id
        WHERE
          u.id = uo.user_id
          AND (
            (us.view_opinions = ${PrivacyCommonSettings.Everyone})
            ${
              parameters.followerId
                ? 'OR (us.view_opinions = ' +
                  PrivacyCommonSettings.FollowersOnly +
                  ' AND uf.follower_id = ' +
                  parameters.followerId +
                  ' AND uf.pending = FALSE)'
                : ''
            }
          )
      )
    GROUP BY
      ufo.id, uo.id, uor.reaction, uor.comment
    ORDER BY
      uo.id DESC
    LIMIT $2
  `,
  values,
});
