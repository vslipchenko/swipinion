import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {BehaviorSubject, finalize} from 'rxjs';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {
  CODE_REGEXP,
  EMAIL_REGEXP,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
} from '~app/constants/validation';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {UserService} from '~app/services/user/user.service';
import {Language} from '~app/typings/i18n/i18n.types';
import {RecoveryStage} from '~app/typings/recovery/recovery.enums';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {InputHideSuffixComponent} from '~app/shared/components/input-hide-suffix/input-hide-suffix.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-recovery-dialog',
  templateUrl: './recovery-dialog.component.html',
  styleUrls: ['./recovery-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatDialogModule,
    InputComponent,
    InputHideSuffixComponent,
    ProgressBarComponent,
    ButtonComponent,
  ],
})
export class RecoveryDialogComponent implements OnDestroy {
  @Output() public readonly recovered = new EventEmitter();
  @Output() public readonly cancel = new EventEmitter();

  protected readonly password = new FormControl('', [
    Validators.required,
    Validators.minLength(PASSWORD_MIN_LENGTH),
    Validators.maxLength(PASSWORD_MAX_LENGTH),
    Validators.pattern(PASSWORD_REGEXP),
  ]);
  protected readonly repeatPassword = new FormControl('', [Validators.required, this.sameValueValidator.bind(this)]);
  protected readonly email = new FormControl('', Validators.required);
  protected readonly code = new FormControl('', Validators.required);
  protected readonly recoverStage$ = new BehaviorSubject(RecoveryStage.Email);
  protected readonly recoveryStage = RecoveryStage;
  protected readonly loading$ = new BehaviorSubject(false);

  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly snackbar: MatSnackBar, private readonly userService: UserService) {
    this.password.valueChanges
      .pipe(this.untilDestroyed())
      .subscribe(() => this.repeatPassword.updateValueAndValidity());
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
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
    }
  }

  protected repeatPasswordErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('required' in errors) return 'Required field';

    return 'Passwords are not the same';
  }

  protected recover(): void {
    if (!this.email.valid) return;

    if (!EMAIL_REGEXP.test(this.email.value as string)) return this.showErrorSnackbar('email');

    this.loading$.next(true);

    this.userService
      .recoverPassword({email: this.email.value as string, language: 'en' as Language})
      .pipe(
        this.untilDestroyed(),
        finalize(() => {
          this.loading$.next(false);
        }),
      )
      .subscribe(
        ({data}) => {
          if (!data?.recoverPassword.success) return this.showErrorSnackbar('email');

          this.snackbar.open('Recovery code was sent to the email', 'OK', {panelClass: 'snackbar-success'});

          // this.emailSent.emit();
          this.recoverStage$.next(RecoveryStage.Code);
        },
        () => this.showErrorSnackbar('email'),
      );
  }

  protected verifyCode(): void {
    this.code.markAsTouched();
    this.code.updateValueAndValidity();

    if (!this.code.valid) return;

    if (!CODE_REGEXP.test(this.code.value as string)) return this.showErrorSnackbar('code');

    this.loading$.next(true);

    this.userService
      .checkRecoveryCodeExistenceByEmail({email: this.email.value as string, code: this.code.value as string})
      .pipe(
        this.untilDestroyed(),
        finalize(() => {
          this.loading$.next(false);
        }),
      )
      .subscribe(
        ({data}) => {
          if (!data?.userWithRecoveryCodeExists.exists) return this.showErrorSnackbar('code');

          this.recoverStage$.next(RecoveryStage.NewPassword);
        },
        () => this.showErrorSnackbar('code'),
      );
  }

  protected setNewPassword(): void {
    this.password.markAsTouched();
    this.password.updateValueAndValidity();

    this.repeatPassword.markAsTouched();
    this.repeatPassword.updateValueAndValidity();

    if (!(this.password.valid && this.repeatPassword.valid)) return;

    this.loading$.next(true);

    this.userService
      .setNewPassword({
        email: this.email.value as string,
        password: this.password.value as string,
        code: this.code.value as string,
      })
      .pipe(
        this.untilDestroyed(),
        finalize(() => {
          this.loading$.next(false);
        }),
      )
      .subscribe(
        ({data}) => {
          if (!data?.setNewPassword.success) return this.showErrorSnackbar('password');

          this.snackbar.open('Password has been changed successfully', 'OK', {
            panelClass: 'snackbar-success',
          });

          this.recovered.emit();
        },
        () => this.showErrorSnackbar('password'),
      );
  }

  private sameValueValidator(control: FormControl): ValidationErrors | null {
    if (control.value === this.password.value) return null;

    return {mismatch: true};
  }

  private showErrorSnackbar(phrase: string): void {
    this.snackbar.open(`Something went wrong. Please check ${phrase} correctness or try again later`, 'OK', {
      panelClass: 'snackbar-error',
    });
  }
}
