import {QueryConfig} from 'pg';
import {FollowSettings} from '../../typings/user-settings/user-settings.enums';
import {NotificationType} from '../../typings/user-notifications/user-notifications.enums';

export const queryFollowUser = (userId: string, followerId: string): QueryConfig => ({
  text: `
    WITH record AS (
      INSERT INTO followers
      (user_id, follower_id, pending)
      VALUES ($1, $2, (SELECT EXISTS (SELECT FROM user_settings WHERE user_id = $1 AND follow = ${FollowSettings.ByApprove})))
      RETURNING id, pending
    )
    INSERT INTO user_notifications
    (type, follower_record_id, user_id, involved_user_id)
    VALUES (
        CASE  
          WHEN (SELECT pending FROM record) = TRUE THEN ${NotificationType.FollowRequest}
          ELSE ${NotificationType.Followed}
        END,
        (SELECT id FROM record),
        $1,
        $2
    )
    RETURNING (SELECT pending FROM record)
  `,
  values: [userId, followerId],
});

export const queryUnfollowUser = (userId: string, followerId: string): QueryConfig => ({
  text: `
    DELETE FROM followers
    WHERE user_id = $1 AND follower_id = $2
  `,
  values: [userId, followerId],
});
