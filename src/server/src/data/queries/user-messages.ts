import {QueryConfig} from 'pg';
import {PrivacyCommonSettings} from '../../typings/user-settings/user-settings.enums';
import {USER_MESSAGES_FETCH_LIMIT} from '../../constants/user-messages';

export const querySendUserMessage = (senderId: string, receiverId: string, body: string): QueryConfig => ({
  text: `
    INSERT INTO user_messages (receiver_id, sender_id, body)
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
      $3
    )
  `,
  values: [senderId, receiverId, body],
});

export const queryFetchUserMessages = (userId: string, startDate?: string): QueryConfig => ({
  text: `
    SELECT DISTINCT ON (user_messages.sender_id) user_messages.sender_id, 
        users.username, 
        users.thumbnail,
        user_messages.id,
        user_messages.body, 
        user_messages.created_at
    FROM user_messages 
    LEFT JOIN users ON users.id = user_messages.sender_id 
    WHERE user_messages.receiver_id = $1 AND user_messages.created_at < $2 -- AND user_messages.created_at < to_timestamp(CAST('1659447481886'as bigint)/1000)
    ORDER BY user_messages.sender_id DESC, user_messages.created_at DESC -- DESC allows to select the most recent user message
    LIMIT $3
  `,
  values: [userId, startDate, USER_MESSAGES_FETCH_LIMIT],
});
