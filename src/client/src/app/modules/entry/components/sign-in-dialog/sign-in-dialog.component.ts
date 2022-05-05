import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, Subject, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {EMAIL_REGEXP, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInDialogComponent implements Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  private readonly signInForm = this.signInFormGroup;

  public constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly snackbar: MatSnackBar,
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public signIn(): void {
    const valid = this.validateForm();

    if (!valid) return this.showErrorSnackbar();

    this.authenticationService.signIn(this.signInForm.value).pipe(takeUntil(this.destroy$)).subscribe();
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  private validateForm(): boolean {
    const validEmail = EMAIL_REGEXP.test(this.email.value);
    const validPassword =
      this.password.value.length >= PASSWORD_MIN_LENGTH &&
      this.password.value.length <= PASSWORD_MAX_LENGTH &&
      PASSWORD_REGEXP.test(this.password.value);

    return validEmail && validPassword;
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. ...', 'OK', {panelClass: 'snackbar-error'});
  }

  public get email(): FormControl {
    return this.signInForm.controls['email'] as FormControl;
  }

  public get password(): FormControl {
    return this.signInForm.controls['password'] as FormControl;
  }

  private get signInFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
}
