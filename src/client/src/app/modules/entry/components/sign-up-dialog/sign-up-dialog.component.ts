import {ChangeDetectionStrategy, Component} from '@angular/core';
import {UserService} from '~app/services/user/user.service';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, finalize, map, Observable} from 'rxjs';
import {EMAIL_REGEXP, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';

@Component({
  selector: 'app-sign-up-component',
  templateUrl: './sign-up-dialog.component.html',
  styleUrls: ['./sign-up-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignUpDialogComponent {
  public readonly loading$ = new BehaviorSubject(false);
  private readonly signUpForm = this.signUpFormGroup;

  public constructor(private readonly userService: UserService) {
  }

  public signUp(): void {
    this.signUpForm.markAllAsTouched();

    if (!this.signUpForm.valid) return;

    this.loading$.next(true);

    this.userService.create(this.signUpForm.value).pipe(finalize(() => this.loading$.next(false))).subscribe();
  }

  private duplicateEmailValidator(control: AbstractControl): Observable<null | ValidationErrors> {
    const email = control.value;

    return this.userService.checkExistenceByEmail(email).pipe(
      map(({data}: {data: any}) => {
        return data.userWithEmailExists.exists ? {duplicateEmail: true} : null;
      }),
    );
  }

  private get signUpFormGroup(): FormGroup {
    return new FormGroup({
      username: new FormControl(null, Validators.required),
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
