import {ChangeDetectionStrategy, Component, EventEmitter, Inject, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, finalize} from 'rxjs';
import {untilDestroyed} from '~app/utilities/operator';
import {EMAIL_REGEXP, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {SignInFailReason} from '~app/typings/authentication/authentication.enums';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule as MatDialogModule,
} from '@angular/material/legacy-dialog';
import {SignIn} from '~app/typings/authentication/authentication.interfaces';
import {UserService} from '~app/services/user/user.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {InputComponent} from '~app/shared/components/input/input.component';
import {InputHideSuffixComponent} from '~app/shared/components/input-hide-suffix/input-hide-suffix.component';
import {CheckboxComponent} from '~app/shared/components/checkbox/checkbox.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatDialogModule,
    InputComponent,
    InputHideSuffixComponent,
    CheckboxComponent,
    ProgressBarComponent,
    ButtonComponent,
  ],
})
export class SignInDialogComponent implements OnInit, OnDestroy {
  @Output() public readonly authenticated = new EventEmitter();
  @Output() public readonly recover = new EventEmitter();
  @Output() public readonly signUp = new EventEmitter();
  @Output() public readonly confirm = new EventEmitter<SignIn>();
  @Output() public readonly cancel = new EventEmitter();

  protected readonly loading$ = new BehaviorSubject(false);
  protected readonly rememberMe = new FormControl(false);
  private readonly signInForm = this.signInFormGroup;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: SignIn,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbar: MatSnackBar, // private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    if (this.data) this.authenticateUser(this.data);
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected signIn(): void {
    const valid = this.validateForm();

    if (!valid) return this.showErrorSnackbar();

    this.authenticateUser(this.signInForm.value);
  }

  protected errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  private authenticateUser(credentials: SignIn): void {
    this.loading$.next(true);

    this.authenticationService
      .signIn(credentials)
      .pipe(
        this.untilDestroyed(),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(
        ({data}) => {
          if (!data.signIn) {
            return this.showErrorSnackbar();
          }

          if (data.signIn.reason === SignInFailReason.Unconfirmed) {
            return this.confirm.emit(credentials);
          }

          if (data.signIn.reason === SignInFailReason.Blocked) {
            return this.snackbar.open('Account is blocked', 'OK', {panelClass: 'snackbar-error'});
          }

          this.authenticationService.resetTokens(); // Clear active session
          // No reason for setting accessToken as page must reload
          this.authenticationService.setRefreshToken(data.signIn.refreshToken, !this.rememberMe.value);

          this.authenticated.emit();
        },
        () => this.showErrorSnackbar(),
      );
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
    this.snackbar.open('Something went wrong. Check data correctness or try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }

  protected get email(): FormControl {
    return this.signInForm.controls['email'] as FormControl;
  }

  protected get password(): FormControl {
    return this.signInForm.controls['password'] as FormControl;
  }

  private get signInFormGroup(): FormGroup {
    return new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }
}
