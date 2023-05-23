import {QueryConfig} from 'pg';
import {OPINION_FETCH_LIMIT} from '../../constants/opinions';
import {OpinionReaction} from '../../typings/opinion/opinion.enums';
import {CommentOpinion} from '../../typings/opinion/opinion.interfaces';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';

export const queryGeneralOpinionsForAuthorizedUser = (userId: string, edgeId?: string): QueryConfig => ({
  text: `
    SELECT user_opinions.id, 
       users.username,
       user_opinions.user_id, 
       user_opinions.type,
       user_opinions.file_url, 
       user_opinions.body, 
       array_agg(tags.tag) AS tags,
       COALESCE(reactions.agreed, 0) AS agreed,
       COALESCE(reactions.disagreed, 0) AS disagreed,
       COALESCE(reactions.comments, 0) AS comments
    FROM user_opinions
    LEFT JOIN (
      SELECT opinion_id,
        COUNT(CASE WHEN reaction = ${OpinionReaction.Agree} THEN 1 END) AS agreed,
        COUNT(CASE WHEN reaction = ${OpinionReaction.Disagree} THEN 1 END) AS disagreed,
        COUNT(CASE WHEN comment IS NOT NULL THEN 1 END) AS comments
      FROM user_opinion_reactions
      GROUP BY opinion_id
    ) AS reactions ON user_opinions.id = reactions.opinion_id
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
    LEFT JOIN users ON user_opinions.user_id = users.id
    LEFT JOIN user_settings ON user_opinions.user_id = user_settings.user_id
    LEFT JOIN user_followers ON user_opinions.user_id = user_followers.user_id
    WHERE
      (
        ${edgeId ? 'user_opinions.id < $3 AND' : ''}
        user_opinions.user_id != $1 AND 
        NOT EXISTS (
            SELECT 1 
            FROM user_opinion_reactions 
            WHERE opinion_id = user_opinions.id 
              AND user_id = $1
        )
      )
      AND
      (
        user_settings.view_opinions = ${PrivacyCommonSettings.Everyone} OR
        (
          user_settings.view_opinions = ${PrivacyCommonSettings.FollowersOnly} AND
          (
            user_followers.follower_id = $1 AND
            user_followers.pending = FALSE
          )
        )
      )
    GROUP BY user_opinions.id, users.username, reactions.agreed, reactions.disagreed, reactions.comments
    ORDER BY user_opinions.id ASC
    LIMIT $2
  `,
  values: edgeId ? [userId, OPINION_FETCH_LIMIT, edgeId] : [userId, OPINION_FETCH_LIMIT],
});

export const queryGeneralOpinionsForUnauthorizedUser = (): QueryConfig => ({
  text: `
     SELECT user_opinions.id,
       users.username,
       user_opinions.user_id, 
       user_opinions.type,
       user_opinions.file_url, 
       user_opinions.body, 
       array_agg(tags.tag) AS tags,
       COALESCE(reactions.agreed, 0) AS agreed,
       COALESCE(reactions.disagreed, 0) AS disagreed,
	     COALESCE(reactions.comments, 0) AS comments
    FROM user_opinions
    LEFT JOIN (
       SELECT opinion_id, 
         COUNT(CASE WHEN reaction = ${OpinionReaction.Agree} THEN 1 END) AS agreed,
         COUNT(CASE WHEN reaction = ${OpinionReaction.Disagree} THEN 1 END) AS disagreed,
         COUNT(CASE WHEN comment IS NOT NULL THEN 1 END) AS comments
       FROM user_opinion_reactions 
       GROUP BY opinion_id
    ) reactions ON user_opinions.id = reactions.opinion_id
    LEFT JOIN users ON user_opinions.user_id = users.id
    LEFT JOIN tags ON user_opinions.id = tags.opinion_id
    LEFT JOIN
      user_settings ON user_opinions.user_id = user_settings.user_id
    WHERE
      user_settings.view_opinions = ${PrivacyCommonSettings.Everyone} -- No need to check followers as user is unauthorized
    GROUP BY user_opinions.id,
      users.username,
      reactions.agreed,
      reactions.disagreed,
      reactions.comments
    ORDER BY user_opinions.id ASC -- Show fresh opinions each time
    LIMIT 2 -- No need for more as there is auth guard that would prevent unauthorized user actions
  `,
});

export const queryCommentOpinion = ({
  opinionId,
  reaction,
  comment,
  userId,
}: CommentOpinion & {userId: string}): QueryConfig => ({
  text: `
    INSERT INTO user_opinion_reactions (opinion_id, user_id, reaction, comment)
    SELECT
      $1,
      CASE
        WHEN us.view_opinions = ${PrivacyCommonSettings.Everyone} THEN $2
        WHEN us.view_opinions = ${PrivacyCommonSettings.FollowersOnly} AND uf.follower_id = $2 AND uf.pending = FALSE THEN $2
        ELSE NULL
      END,
      $3,
      $4
    FROM user_opinions AS uo
    JOIN user_settings AS us ON uo.user_id = us.user_id
    LEFT JOIN user_followers AS uf ON uo.user_id = uf.user_id
    WHERE uo.id = $1 AND uo.user_id != $2 -- Disallow commenting own opinions
  `,
  values: [opinionId, userId, reaction, comment],
});
