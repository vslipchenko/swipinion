import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AbstractControl, FormControl, ValidationErrors, Validators} from '@angular/forms';
import {BIO_MAX_LENGTH, FILE_URL_MAX_LENGTH, MAX_IMAGE_SIZE_MB} from '~app/constants/validation';
import {BehaviorSubject, finalize, Subject, switchMap, takeUntil, throwError} from 'rxjs';
import {isValidHttpUrl} from '~app/utilities/url';
import {MatDialogRef} from '@angular/material/dialog';
import {UserService} from '~app/services/user/user.service';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {ImageService} from '~app/services/image/image.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Store} from '@ngxs/store';
import {UpdateUserProfile} from '~app/modules/app/store/app.actions';
import {EditProfileMutationResult} from '~app/typings/user/user.interfaces';
import {MutationResult} from 'apollo-angular';
import {AppSelectors} from '~app/modules/app/store/app.selectors';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialogComponent implements Destroyable {
  public readonly imageUrl = new FormControl(null, this.imageValidator.bind(this));
  public readonly file = new FormControl(null, this.fileSizeValidator.bind(this));
  public readonly bio = new FormControl(null, Validators.maxLength(BIO_MAX_LENGTH));

  public readonly destroy$ = new Subject<void>();
  public readonly loading$ = new BehaviorSubject(false);

  public constructor(
    private readonly dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store,
  ) {
    const {thumbnail, bio} = this.store.selectSnapshot(AppSelectors.userProfile);

    // Set default values
    this.imageUrl.setValue(thumbnail);
    this.bio.setValue(bio);
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public imageUrlErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('url' in errors) return 'Invalid image url';

    if ('size' in errors) return `Invalid image. File size exceeds ${MAX_IMAGE_SIZE_MB}MB`;

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  public bioErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${BIO_MAX_LENGTH} characters at max`;
  }

  public save(): void {
    const validControls = this.file.valid && this.imageUrl.valid && this.bio.valid;

    if (!validControls) return;

    this.loading$.next(true);

    if (this.file.value) {
      let thumbnail: string; // TODO: this is a bad approach

      this.imageService
        .uploadImage(this.file.value)
        .pipe(
          switchMap((result) => {
            if (!result.success) return throwError('');

            thumbnail = result.data.thumb.url;

            return this.userService.editProfile({
              thumbnail: result.data.thumb.url,
              bio: this.bio.value,
            });
          }),
          takeUntil(this.destroy$),
          finalize(() => this.loading$.next(false)),
        )
        .subscribe(
          (result) => this.handleSuccessfulResponse(result, thumbnail),
          () => this.showErrorSnackbar(),
        );
      return;
    }

    this.userService
      .editProfile({thumbnail: this.imageUrl.value, bio: this.bio.value})
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(this.handleSuccessfulResponse.bind(this), () => this.showErrorSnackbar());
  }

  private handleSuccessfulResponse({data}: MutationResult<EditProfileMutationResult>, thumbnail?: string): void {
    if (!data?.editProfile.success) return this.showErrorSnackbar();

    this.snackbar.open('Profile changes successfully saved', 'OK', {
      panelClass: 'snackbar-success',
    });

    this.store.dispatch(
      new UpdateUserProfile({
        thumbnail: thumbnail || this.imageUrl.value,
        bio: this.bio.value,
      }),
    );

    this.dialogRef.close();
  }

  private showErrorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please try again later', 'OK', {
      panelClass: 'snackbar-error',
    });
  }

  private imageValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if (this.file?.value) return null;

    if (!isValidHttpUrl(control.value)) return {url: true};

    if (control.value.length > FILE_URL_MAX_LENGTH) return {maxlength: true};

    return null;
  }

  private fileSizeValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((control.value as File).size / 1024 ** 2 > MAX_IMAGE_SIZE_MB) return {size: true};

    return null;
  }
}
