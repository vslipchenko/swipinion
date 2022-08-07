import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {USER_MESSAGES_FETCH_LIMIT} from '../../constants/user-messages';

export const querySendUserMessage = (
  senderId: string,
  receiverId: string,
  body: string,
  teaser: string,
): QueryConfig => ({
  text: `
    INSERT INTO user_messages (receiver_id, sender_id, body, teaser)
    VALUES (
      (
        SELECT user_settings.user_id
        FROM   user_settings
               LEFT JOIN user_followers
                      ON user_settings.user_id = user_followers.user_id
        WHERE  user_settings.user_id = $2 
               AND user_settings.message != ${PrivacyCommonSettings.NoOne}       -- Check whether messaging is disabled on behalf of receiver
               AND user_settings.message = ${PrivacyCommonSettings.Everyone}     -- Check whether messaging is allowed to everyone
                OR user_followers.follower_id = $1                               -- If messaging is allowed only for followers; check whether sender has accepted following
                   AND user_followers.pending IS FALSE
      ),
      $1,
      $3,
      $4
    )
  `,
  values: [senderId, receiverId, body, teaser],
});

export const queryFetchUserMessages = (userId: string, startDate?: string): QueryConfig => ({
  text: `
    SELECT user_messages.id, 
      user_messages.teaser, 
      conversations.greatest AS user_id_1, 
      conversations.least AS user_id_2, 
      conversations.maxdate AS created_at, 
      users.username, 
      users.thumbnail
    FROM 
    (
      SELECT DISTINCT GREATEST(sender_id, receiver_id), LEAST(sender_id, receiver_id), MAX(created_at) AS maxdate
      FROM user_messages
      WHERE sender_id = $1
        OR receiver_id = $1
      GROUP BY GREATEST(sender_id, receiver_id), LEAST(sender_id, receiver_id)
      HAVING MAX(created_at) <= $2
      ORDER BY maxdate DESC
      LIMIT $3
    ) AS conversations
    LEFT JOIN user_messages ON conversations.maxdate = user_messages.created_at 
      AND user_messages.sender_id = conversations.greatest AND user_messages.receiver_id = conversations.least
      OR user_messages.sender_id = conversations.least AND user_messages.receiver_id = conversations.greatest
    LEFT JOIN users ON (users.id = user_messages.receiver_id OR users.id = user_messages.sender_id) AND users.id != $1
  `,
  values: [userId, startDate, USER_MESSAGES_FETCH_LIMIT],
});
