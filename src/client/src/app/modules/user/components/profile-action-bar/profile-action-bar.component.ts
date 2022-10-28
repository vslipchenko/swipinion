import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {UserRole} from '~app/typings/user/user.enums';
import {Observable} from 'rxjs';
import {Select, Store} from '@ngxs/store';
import {FollowUser} from '~app/modules/user/store/user.actions';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {UnfollowUserDialogComponent} from '~app/modules/user/components/unfollow-user-dialog/unfollow-user-dialog.component';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {SetActiveConversation} from '~app/modules/app/store/app.actions';
import {ActiveConversationType} from '~app/typings/user-conversations/user-conversations.enums';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-profile-action-bar',
  templateUrl: './profile-action-bar.component.html',
  styleUrls: ['./profile-action-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileActionBarComponent {
  @Input() public role = UserRole.Guest;
  @Input() public id = '';
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public showBottomBar = false;
  @Input() public wrapper!: HTMLDivElement;

  // @Select(UserSelectors.following) public following$!: Observable<boolean>;
  @Select(UserSelectors.followingStatus) public followingStatus$!: Observable<{following: boolean; pending: boolean}>;

  public readonly userRole = UserRole;
  public readonly userSettings!: UserSettings;
  public readonly isProfilePath!: boolean;

  // public readonly privacyCommonSettings = PrivacyCommonSettings;

  public constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    this.userSettings = this.store.selectSnapshot(UserSelectors.settings);
    this.isProfilePath = this.store.selectSnapshot(UserSelectors.isProfilePath);
  }

  public message(): void {
    if (this.role === UserRole.User) {
      this.store.dispatch(
        new SetActiveConversation({
          edgeId: '',
          userId1: '',
          userId2: '',
          username: '',
          thumbnail: '',
          unread: false,
          type: ActiveConversationType.SavedMessages,
        }),
      );
      return;
    }

    // Assume role is viewer; otherwise guard
    const {username, thumbnail, id} = this.store.selectSnapshot(UserSelectors.resolvedUserEssentials);

    const userId = this.store.selectSnapshot(AppSelectors.userId);

    this.store.dispatch(
      new SetActiveConversation({
        edgeId: this.store.selectSnapshot(AppSelectors.conversationMessages(userId, id))?.[0]?.id,
        userId1: userId, // Authed user id
        userId2: id, // Resolved user id / Interlocutor id
        username,
        thumbnail,
        unread: this.store.selectSnapshot(AppSelectors.unreadMessages).some((message) => message.sender_id === id),
        type: ActiveConversationType.UserConversation,
      }),
    );
  }

  public follow(): void {
    this.store.dispatch(new FollowUser(this.id));
  }

  public unfollow(pending = false): void {
    this.dialog.open(UnfollowUserDialogComponent, {
      panelClass: ['dialog', 'extended-dialog'],
      data: {
        title: pending ? 'Revoke follow request' : 'Unfollow user',
        body: pending ? 'Waiting for follow request to be accepted. Do you want to revoke follow of' : 'Unfollow',
        action: pending ? 'Revoke' : 'Unfollow',
      },
    });
  }

  public scrollTop(): void {
    this.wrapper.scrollTo({top: 0, behavior: 'smooth'});
  }

  public get canMessage(): boolean {
    if (this.isProfilePath) return true;

    const followingStatus = this.store.selectSnapshot(UserSelectors.followingStatus); // TODO rename to following status

    if (followingStatus.pending) return false;

    switch (this.userSettings.message) {
      case PrivacyCommonSettings.FollowersOnly:
        return followingStatus.following;
      case PrivacyCommonSettings.NoOne:
        return false;
      default:
        return true;
    }
  }

  public get pendingFollowing(): boolean {
    return this.store.selectSnapshot(UserSelectors.followingStatus).pending;
  }
}
