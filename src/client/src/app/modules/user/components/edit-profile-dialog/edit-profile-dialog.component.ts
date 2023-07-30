import {ChangeDetectionStrategy, Component, Inject, OnDestroy} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {BIO_MAX_LENGTH, FILE_URL_MAX_LENGTH, IMAGE_EXTENSION, MAX_IMAGE_SIZE_MB} from '~app/constants/validation';
import {BehaviorSubject, finalize, switchMap, throwError} from 'rxjs';
import {isValidHttpUrl} from '~app/utilities/url';
import {
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogRef as MatDialogRef,
} from '@angular/material/legacy-dialog';
import {UserService} from '~app/services/user/user.service';
import {untilDestroyed} from '~app/utilities/operator';
import {ImageService} from '~app/services/image/image.service';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {Store} from '@ngxs/store';
import {UpdateUserEssentials} from '~app/modules/app/store/app.actions';
import {EditProfileMutationResult, ResolvedUserData} from '~app/typings/user/user.interfaces';
import {MutationResult} from 'apollo-angular';
import {hasExtension} from '~app/utilities/file';
import {EditUserProfile} from '~app/modules/user/store/user.actions';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialogComponent implements OnDestroy {
  protected readonly editProfileForm = this.editProfileFormGroup;

  protected readonly loading$ = new BehaviorSubject(false);
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: ResolvedUserData,
    private readonly dialogRef: MatDialogRef<EditProfileDialogComponent>,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
    private readonly snackbar: MatSnackBar,
    private readonly store: Store,
  ) {
    // Set default values
    this.imageUrl.setValue(data.thumbnail);
    this.bio.setValue(data.bio);
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  protected imageUrlErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('url' in errors) return 'Invalid image url';

    if ('type' in errors) return 'Invalid image. Unsupported type';

    if ('size' in errors) return `Invalid image. File size exceeds ${MAX_IMAGE_SIZE_MB}MB`;

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  protected bioErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${BIO_MAX_LENGTH} characters at max`;
  }

  protected save(): void {
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

            const isGif = result.data.image.extension === 'gif';
            thumbnail = isGif ? result.data.image.url : result.data.thumb.url;

            return this.userService.editProfile({
              thumbnail,
              bio: this.bio.value || null,
            });
          }),
          this.untilDestroyed(),
          finalize(() => this.loading$.next(false)),
        )
        .subscribe(
          (result) => this.handleSuccessfulResponse(result, thumbnail),
          () => this.showErrorSnackbar(),
        );
      return;
    }

    this.userService
      .editProfile({thumbnail: this.imageUrl.value, bio: this.bio.value || null})
      .pipe(
        this.untilDestroyed(),
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(this.handleSuccessfulResponse.bind(this), () => this.showErrorSnackbar());
  }

  private handleSuccessfulResponse({data}: MutationResult<EditProfileMutationResult>, thumbnail?: string): void {
    if (!data?.editProfile.success) return this.showErrorSnackbar();

    this.snackbar.open('Profile changes successfully saved', 'OK', {
      panelClass: 'snackbar-success',
    });

    thumbnail = thumbnail || (this.imageUrl.value as string);

    this.store.dispatch(
      new UpdateUserEssentials({
        thumbnail,
      }),
    );

    this.store.dispatch(
      new EditUserProfile({
        thumbnail,
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

    if (!hasExtension(control.value, IMAGE_EXTENSION)) return {type: true};

    if (control.value.length > FILE_URL_MAX_LENGTH) return {maxlength: true};

    return null;
  }

  private fileSizeValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((control.value as File).size / 1024 ** 2 > MAX_IMAGE_SIZE_MB) return {size: true};

    return null;
  }

  protected get imageUrl(): FormControl {
    return this.editProfileForm.controls['imageUrl'] as FormControl;
  }

  protected get bio(): FormControl {
    return this.editProfileForm.controls['bio'] as FormControl;
  }

  protected get file(): FormControl {
    return this.editProfileForm.controls['file'] as FormControl;
  }

  private get editProfileFormGroup(): FormGroup {
    return new FormGroup({
      imageUrl: new FormControl(null, this.imageValidator.bind(this)),
      file: new FormControl(null, this.fileSizeValidator.bind(this)),
      bio: new FormControl(null, Validators.maxLength(BIO_MAX_LENGTH)),
    });
  }
}
