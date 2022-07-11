import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UserService} from '~app/services/user/user.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {Subject, takeUntil} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserSettingsComponent implements Destroyable {
  public readonly destroy$ = new Subject<void>();
  public readonly changePasswordForm = new FormGroup({
    currentPassword: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(PASSWORD_MIN_LENGTH),
      Validators.maxLength(PASSWORD_MAX_LENGTH),
      Validators.pattern(PASSWORD_REGEXP),
      this.duplicatePasswordValidator.bind(this),
    ]),
  });

  public constructor(private readonly userService: UserService, private readonly snackbar: MatSnackBar) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public changePassword(): void {
    this.changePasswordForm.markAllAsTouched();
    this.currentPassword.updateValueAndValidity();
    this.newPassword.updateValueAndValidity();

    if (!this.changePasswordForm.valid) return;

    const validCurrentPassword =
      PASSWORD_REGEXP.test(this.currentPassword.value) &&
      this.currentPassword.value.length >= PASSWORD_MIN_LENGTH &&
      this.currentPassword.value.length <= PASSWORD_MAX_LENGTH;

    if (!validCurrentPassword) return this.showErrorSnackbar();

    this.userService
      .changePassword(this.changePasswordForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ({data}) => {
          if (!data?.changePassword?.success) {
            this.showErrorSnackbar();
            return;
          }

          this.snackbar.open('Password has been changed successfully', 'OK', {
            panelClass: 'snackbar-success',
          });

          this.changePasswordForm.reset();
        },
        () => this.showErrorSnackbar(),
      );
  }

  public passwordErrorMessage(errors: ValidationErrors | null): string | void {
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
    this.snackbar.open('Something went wrong. Please check password correctness or try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }

  private duplicatePasswordValidator(control: FormControl): ValidationErrors | null {
    if (!this.currentPassword?.value && !control.value) return null;

    return control.value === this.currentPassword.value ? {duplicate: true} : null;
  }

  public get currentPassword(): FormControl {
    return this.changePasswordForm?.controls['currentPassword'] as FormControl;
  }

  public get newPassword(): FormControl {
    return this.changePasswordForm.controls['newPassword'] as FormControl;
  }
}
