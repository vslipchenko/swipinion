import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {UserService} from '~app/services/user/user.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';
import {Actions, ofActionErrored, ofActionSuccessful, Store} from '@ngxs/store';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';
import {FollowSettings, PrivacyCommonSettings} from '~app/typings/user-settings/user-settings.enums';
import {UserSettingsSelectors} from '~app/modules/user-settings/store/user-settings.selectors';
import {UpdateProfileSettings} from '~app/modules/user-settings/store/user-settings.actions';
import {ChangePassword} from '~app/typings/user/user.interfaces';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements OnDestroy {
  // TODO consider adding Change username functionality

  protected readonly privacyForm = new FormGroup({
    follow: new FormControl(FollowSettings.Everyone),
    message: new FormControl(PrivacyCommonSettings.Everyone),
    view_followers: new FormControl(PrivacyCommonSettings.Everyone),
    view_following: new FormControl(PrivacyCommonSettings.Everyone),
    view_opinions: new FormControl(PrivacyCommonSettings.Everyone),
    view_reactions: new FormControl(PrivacyCommonSettings.Everyone),
    view_favorites: new FormControl(PrivacyCommonSettings.Everyone),
  });

  protected readonly followSettings = [
    {title: 'To anyone', value: FollowSettings.Everyone},
    {title: 'By approve', value: FollowSettings.ByApprove},
  ];

  protected readonly otherSettings = [
    {title: 'Everyone', value: PrivacyCommonSettings.Everyone},
    {title: 'Followers only', value: PrivacyCommonSettings.FollowersOnly},
    {
      title: 'No one',
      value: PrivacyCommonSettings.NoOne,
    },
  ];

  protected readonly changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(PASSWORD_MIN_LENGTH),
      Validators.maxLength(PASSWORD_MAX_LENGTH),
      Validators.pattern(PASSWORD_REGEXP),
      this.duplicatePasswordValidator.bind(this),
    ]),
  });

  protected readonly loading$ = new BehaviorSubject(false);
  private readonly cancelPasswordChange$ = new Subject<void>();
  private readonly cancelPrivacy$ = new Subject<void>();

  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly userService: UserService,
    private readonly snackbar: MatSnackBar,
    private readonly actions$: Actions,
  ) {
    const {follow, message, view_followers, view_following, view_opinions, view_reactions, view_favorites} =
      this.store.selectSnapshot(UserSettingsSelectors.settings);

    // Set initial values;
    this.privacyForm.setValue({
      follow,
      message,
      view_followers,
      view_following,
      view_opinions,
      view_reactions,
      view_favorites,
    });

    this.actions$.pipe(this.untilDestroyed(), ofActionSuccessful(UpdateProfileSettings)).subscribe(() => {
      this.loading$.next(false);
      this.privacyForm.markAsPristine();
      this.snackbar.open('Privacy settings successfully updated', 'OK', {
        panelClass: 'snackbar-success',
      });
    });

    this.actions$.pipe(this.untilDestroyed(), ofActionErrored(UpdateProfileSettings)).subscribe(() => {
      this.loading$.next(false);
      this.showErrorSnackbar();
    });
  }

  public ngOnDestroy(): void {
    this.cancelPasswordChange$.complete();
    this.cancelPrivacy$.complete();
    this.loading$.complete();
  }

  protected cancelPrivacy(): void {
    const {follow, message, view_followers, view_following, view_opinions, view_reactions, view_favorites} =
      this.store.selectSnapshot(UserSettingsSelectors.settings);
    // Reset to current values
    this.privacyForm.reset({
      follow,
      message,
      view_followers,
      view_following,
      view_opinions,
      view_reactions,
      view_favorites,
    });
    this.cancelPrivacy$.next();
  }

  protected updatePrivacySettings(): void {
    this.loading$.next(true);

    this.store.dispatch(new UpdateProfileSettings(this.privacyForm.value as UserSettings));
  }

  protected cancelPasswordChange(): void {
    this.changePasswordForm.reset();
    this.cancelPasswordChange$.next();
  }

  protected changePassword(): void {
    this.changePasswordForm.markAllAsTouched();
    this.currentPassword.updateValueAndValidity();
    this.newPassword.updateValueAndValidity();

    if (!this.changePasswordForm.valid) return;

    const validCurrentPassword =
      PASSWORD_REGEXP.test(this.currentPassword.value) &&
      this.currentPassword.value.length >= PASSWORD_MIN_LENGTH &&
      this.currentPassword.value.length <= PASSWORD_MAX_LENGTH;

    if (!validCurrentPassword) return this.showPasswordChangeErrorSnackbar();

    this.loading$.next(true);

    this.userService
      .changePassword(this.changePasswordForm.value as ChangePassword)
      .pipe(
        this.untilDestroyed(),
        takeUntil(this.cancelPasswordChange$),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(
        ({data}) => {
          if (!data?.changePassword?.success) {
            this.showPasswordChangeErrorSnackbar();
            return;
          }

          this.snackbar.open('Password has been changed successfully', 'OK', {
            panelClass: 'snackbar-success',
          });

          this.changePasswordForm.reset();
        },
        () => this.showPasswordChangeErrorSnackbar(),
      );
  }

  protected passwordErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    switch (true) {
      case 'required' in errors:
        return 'Required field';
      case 'minlength' in errors:
        return `${PASSWORD_MIN_LENGTH} characters at least`;
      case 'maxlength' in errors:
        return `${PASSWORD_MAX_LENGTH} characters at max`;
      case 'pattern' in errors:
        return 'Should contain at least one letter and digit. Allowed special characters';
      case 'duplicate' in errors:
        return 'Current and new password are the same';
    }
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }

  private showPasswordChangeErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please check password correctness or try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }

  private duplicatePasswordValidator(control: FormControl): ValidationErrors | null {
    if (!this.currentPassword?.value && !control.value) return null;

    return control.value === this.currentPassword.value ? {duplicate: true} : null;
  }

  protected get follow(): FormControl {
    return this.privacyForm.controls['follow'] as FormControl;
  }

  protected get message(): FormControl {
    return this.privacyForm.controls['message'] as FormControl;
  }

  protected get viewFollowers(): FormControl {
    return this.privacyForm.controls['view_followers'] as FormControl;
  }

  protected get viewFollowing(): FormControl {
    return this.privacyForm.controls['view_following'] as FormControl;
  }

  protected get viewOpinions(): FormControl {
    return this.privacyForm.controls['view_opinions'] as FormControl;
  }

  protected get viewReactions(): FormControl {
    return this.privacyForm.controls['view_reactions'] as FormControl;
  }

  protected get viewFavorites(): FormControl {
    return this.privacyForm.controls['view_favorites'] as FormControl;
  }

  protected get currentPassword(): FormControl {
    return this.changePasswordForm?.controls['currentPassword'] as FormControl;
  }

  protected get newPassword(): FormControl {
    return this.changePasswordForm.controls['newPassword'] as FormControl;
  }
}
