import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, Output} from '@angular/core';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {untilDestroyed} from '~app/utilities/operator';
import {BehaviorSubject, finalize} from 'rxjs';
import {CODE_REGEXP, EMAIL_REGEXP} from '~app/constants/validation';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {UserService} from '~app/services/user/user.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';
import {InputComponent} from '~app/shared/components/input/input.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';

@Component({
  selector: 'app-email-confirmation-dialog',
  templateUrl: './email-confirmation-dialog.component.html',
  styleUrls: ['./email-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, AsyncPipe, MatDialogModule, InputComponent, ProgressBarComponent, ButtonComponent],
})
export class EmailConfirmationDialogComponent implements OnDestroy {
  @Output() public readonly emailConfirmed = new EventEmitter();
  @Output() public readonly cancel = new EventEmitter();

  public email = '';
  protected readonly code = new FormControl('', Validators.required);
  protected readonly loading$ = new BehaviorSubject(false);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly snackbar: MatSnackBar, private readonly userService: UserService) {}

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  protected confirm(): void {
    if (!this.code.valid) return;

    // const email = this.email || decodeURI(this.activatedRoute.snapshot.queryParams['email']);

    const validCode = CODE_REGEXP.test(this.code.value as string);
    const validEmail = EMAIL_REGEXP.test(this.email);

    if (!(validCode && validEmail)) return this.showErrorSnackbar();

    this.loading$.next(true);

    this.userService
      .confirmEmail({email: this.email, code: this.code.value as string})
      .pipe(
        this.untilDestroyed(),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(
        ({data}) => {
          if (!data?.confirmEmail.success) return this.showErrorSnackbar();

          this.snackbar.open('Email successfully confirmed', 'OK', {
            panelClass: 'snackbar-success',
          });

          this.emailConfirmed.emit();
        },
        () => this.showErrorSnackbar(),
      );
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please check code correctness or try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }
}
