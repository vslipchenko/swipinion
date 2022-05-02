import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UserService} from '~app/services/user/user.service';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, finalize, map, Observable} from 'rxjs';
import {
  EMAIL_REGEXP,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEXP,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEXP,
} from '~app/constants/validation';

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpDialogComponent {
  public readonly loading$ = new BehaviorSubject(false);
  private readonly signUpForm = this.signUpFormGroup;

  public constructor(private readonly userService: UserService) {}

  public signUp(): void {
    this.signUpForm.markAllAsTouched();

    this.username.updateValueAndValidity();
    this.email.updateValueAndValidity();
    this.password.updateValueAndValidity();

    setTimeout(() => {
      console.log(this.signUpForm, this.signUpForm.valid, !this.signUpForm.valid);
      if (!this.signUpForm.valid) return;

      this.loading$.next(true);

      console.log('send');

      this.userService
        .create({...this.signUpForm.value, language: 'en'})
        .pipe(finalize(() => this.loading$.next(false)))
        .subscribe(console.log);
    });
  }

  public usernameErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    switch (true) {
      case 'required' in errors:
        return 'Required field';
      case 'pattern' in errors:
        return 'Should contain lowercase letters (separated with dot)';
      case 'minlength' in errors:
        return `${USERNAME_MIN_LENGTH} characters at least`;
      case 'maxlength' in errors:
        return `${USERNAME_MAX_LENGTH} characters at max`;
      case 'duplicateUsername' in errors:
        return 'Username already taken';
    }
  }

  public emailErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    switch (true) {
      case 'required' in errors:
        return 'Required field';
      case 'pattern' in errors:
        return 'Invalid format';
      case 'duplicateEmail' in errors:
        return 'User with such an email already exists';
    }
  }

  public passwordErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    switch (true) {
      case 'required' in errors:
        return 'Required';
      case 'minlength' in errors:
        return `${PASSWORD_MIN_LENGTH} characters at least`;
      case 'maxlength' in errors:
        return `${PASSWORD_MAX_LENGTH} characters at max`;
      case 'pattern' in errors:
        return 'Should contain at least one letter and digit. Allowed special characters';
    }
  }

  private duplicateUsernameValidator(control: AbstractControl): Observable<null | ValidationErrors> {
    const username = control.value;

    return this.userService.checkExistenceByUsername(username).pipe(
      map(({data}) => {
        return data.userWithUsernameExists.exists ? {duplicateUsername: true} : null;
      }),
    );
  }

  private duplicateEmailValidator(control: AbstractControl): Observable<null | ValidationErrors> {
    const email = control.value;

    return this.userService.checkExistenceByEmail(email).pipe(
      map(({data}) => {
        return data.userWithEmailExists.exists ? {duplicateEmail: true} : null;
      }),
    );
  }

  public get username(): FormControl {
    return this.signUpForm.controls['username'] as FormControl;
  }

  public get email(): FormControl {
    return this.signUpForm.controls['email'] as FormControl;
  }

  public get password(): FormControl {
    return this.signUpForm.controls['password'] as FormControl;
  }

  private get signUpFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl(null, {
        validators: [
          Validators.required,
          Validators.pattern(USERNAME_REGEXP),
          Validators.minLength(USERNAME_MIN_LENGTH),
          Validators.maxLength(USERNAME_MAX_LENGTH),
        ],
        asyncValidators: this.duplicateUsernameValidator.bind(this),
        updateOn: 'blur', // Make API call on blur
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.pattern(EMAIL_REGEXP)],
        asyncValidators: this.duplicateEmailValidator.bind(this),
        updateOn: 'blur', // Make API call on blur
      }),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(PASSWORD_MIN_LENGTH),
        Validators.maxLength(PASSWORD_MAX_LENGTH),
        Validators.pattern(PASSWORD_REGEXP),
      ]),
    });
  }
}
