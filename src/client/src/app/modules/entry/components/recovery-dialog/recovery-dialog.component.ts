import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {
  CODE_REGEXP,
  EMAIL_REGEXP,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
} from '~app/constants/validation';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '~app/services/user/user.service';
import {Language} from '~app/typings/i18n/i18n.types';
import {RecoveryStage} from '~app/typings/recovery/recovery.enums';

@Component({
  selector: 'app-recovery-dialog',
  templateUrl: './recovery-dialog.component.html',
  styleUrls: ['./recovery-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryDialogComponent implements Destroyable {
  @Output() public readonly recovered = new EventEmitter();
  @Output() public readonly cancel = new EventEmitter();

  public readonly password = new FormControl(null, [
    Validators.required,
    Validators.minLength(PASSWORD_MIN_LENGTH),
    Validators.maxLength(PASSWORD_MAX_LENGTH),
    Validators.pattern(PASSWORD_REGEXP),
  ]);
  public readonly repeatPassword = new FormControl(null, [Validators.required, this.sameValueValidator.bind(this)]);
  public readonly email = new FormControl(null, Validators.required);
  public readonly code = new FormControl('', Validators.required);
  public readonly recoverStage$ = new BehaviorSubject(RecoveryStage.Email);
  public readonly recoveryStage = RecoveryStage;
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly snackbar: MatSnackBar, private readonly userService: UserService) {
    this.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.repeatPassword.updateValueAndValidity());
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
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
    }
  }

  public repeatPasswordErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('required' in errors) return 'Required field';

    return 'Passwords are not the same';
  }

  public recover(): void {
    if (!this.email.valid) return;

    if (!EMAIL_REGEXP.test(this.email.value)) return this.showErrorSnackbar('email');

    this.loading$.next(true);

    this.userService
      .recoverPassword({email: this.email.value, language: 'en' as Language})
      .pipe(
        takeUntil(this.destroy$),
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

  public verifyCode(): void {
    this.code.markAsTouched();
    this.code.updateValueAndValidity();

    if (!this.code.valid) return;

    if (!CODE_REGEXP.test(this.code.value)) return this.showErrorSnackbar('code');

    this.loading$.next(true);

    this.userService
      .checkRecoveryCodeExistenceByEmail({email: this.email.value, code: this.code.value})
      .pipe(
        takeUntil(this.destroy$),
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

  public setNewPassword(): void {
    this.password.markAsTouched();
    this.password.updateValueAndValidity();

    this.repeatPassword.markAsTouched();
    this.repeatPassword.updateValueAndValidity();

    if (!(this.password.valid && this.repeatPassword.valid)) return;

    this.loading$.next(true);

    this.userService
      .setNewPassword({email: this.email.value, password: this.password.value, code: this.code.value})
      .pipe(
        takeUntil(this.destroy$),
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

  // private get passwordValidators(): Array<Validators> {
  //   return [
  //     Validators.required,
  //     Validators.minLength(PASSWORD_MIN_LENGTH),
  //     Validators.maxLength(PASSWORD_MAX_LENGTH),
  //     Validators.pattern(PASSWORD_REGEXP),
  //   ]
  // }
}
