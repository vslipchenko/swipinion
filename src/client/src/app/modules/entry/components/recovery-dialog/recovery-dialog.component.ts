import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {CODE_REGEXP, EMAIL_REGEXP} from '~app/constants/validation';
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
  // @Output() public readonly emailSent = new EventEmitter();
  @Output() public readonly cancel = new EventEmitter();

  public readonly password = new FormControl(null, Validators.required);
  public readonly repeatPassword = new FormControl(null, Validators.required);
  public readonly email = new FormControl(null, Validators.required);
  public readonly code = new FormControl('', Validators.required);
  public readonly recoverStage$ = new BehaviorSubject(RecoveryStage.Email);
  public readonly recoveryStage = RecoveryStage;
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly snackbar: MatSnackBar, private readonly userService: UserService) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
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

  public setNewPassword(): void {}

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
