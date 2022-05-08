import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {EMAIL_REGEXP} from '~app/constants/validation';
import {MatSnackBar} from '@angular/material/snack-bar';
import {UserService} from '~app/services/user/user.service';
import {Language} from '~app/typings/i18n/i18n.types';

@Component({
  selector: 'app-recovery-dialog',
  templateUrl: './recovery-dialog.component.html',
  styleUrls: ['./recovery-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecoveryDialogComponent implements Destroyable {
  @Output() public readonly emailSent = new EventEmitter();

  public readonly email = new FormControl(null, Validators.required);
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

    if (!EMAIL_REGEXP.test(this.email.value)) return this.showErrorSnackbar();

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
          if (!data?.recoverPassword.success) return this.showErrorSnackbar();

          this.snackbar.open('Confirmation email was sent', 'OK', {panelClass: 'snackbar-success'});

          this.emailSent.emit();
        },
        () => this.showErrorSnackbar(),
      );
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please check email correctness or try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }
}
