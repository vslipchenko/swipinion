import {ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {AuthenticationService} from '~app/services/authentication/authentication.service';
import {FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BehaviorSubject, finalize, of, Subject, switchMap, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {EMAIL_REGEXP, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_REGEXP} from '~app/constants/validation';
import {MatSnackBar} from '@angular/material/snack-bar';
import {SignInFailReason} from '~app/typings/authentication/authentication.enums';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {SignIn} from '~app/typings/authentication/authentication.interfaces';
import {Store} from '@ngxs/store';
import {Router} from '@angular/router';
import {UserService} from '~app/services/user/user.service';
import {ApolloQueryResult} from '@apollo/client/core';
import {UserEssentialsQueryResult} from '~app/typings/user/user.interfaces';
import {UpdateUserEssentials} from '~app/modules/app/store/app.actions';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignInDialogComponent implements OnInit, Destroyable {
  @Output() public readonly authenticated = new EventEmitter();
  @Output() public readonly recover = new EventEmitter();
  @Output() public readonly signUp = new EventEmitter();
  @Output() public readonly confirm = new EventEmitter<SignIn>();
  @Output() public readonly cancel = new EventEmitter();

  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly rememberMe = new FormControl(false);
  private readonly signInForm = this.signInFormGroup;

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: SignIn,
    private readonly userService: UserService,
    private readonly authenticationService: AuthenticationService,
    private readonly snackbar: MatSnackBar, // private readonly router: Router,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    if (this.data) this.authenticateUser(this.data);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public signIn(): void {
    const valid = this.validateForm();

    if (!valid) return this.showErrorSnackbar();

    this.authenticateUser(this.signInForm.value);
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  private authenticateUser(credentials: SignIn): void {
    this.loading$.next(true);

    this.authenticationService
      .signIn(credentials)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(({data}) => {
          if (!data.signIn) {
            this.showErrorSnackbar();
            return of({data: {}} as ApolloQueryResult<UserEssentialsQueryResult>);
          }

          if (data.signIn.reason === SignInFailReason.Unconfirmed) {
            this.confirm.emit(credentials);
            return of({data: {}} as ApolloQueryResult<UserEssentialsQueryResult>);
          }

          if (data.signIn.reason === SignInFailReason.Blocked) {
            this.snackbar.open('Account is blocked', 'OK', {panelClass: 'snackbar-error'});
            return of({data: {}} as ApolloQueryResult<UserEssentialsQueryResult>);
          }

          this.authenticationService.resetTokens(); // Clear active session

          this.authenticationService.accessToken$.next(data.signIn.accessToken);
          this.authenticationService.setRefreshToken(data.signIn.refreshToken, !this.rememberMe.value);

          return this.userService.getUserEssentials();
        }),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(
        ({data}) => {
          if (!data.userEssentials) return this.showErrorSnackbar();

          this.store.dispatch(new UpdateUserEssentials(data.userEssentials));

          const userModule = this.router.url.startsWith('/user/');
          if (userModule) return window.location.reload(); // Reload in order to actualize a user state; this fixes stale user state data

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
