import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, finalize, Subject, switchMap, takeUntil, throwError} from 'rxjs';
import {AbstractControl, UntypedFormControl, UntypedFormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {SelectItem} from '~app/typings/select/select.interfaces';
import {
  DESCRIPTION_MAX_LENGTH,
  FILE_URL_MAX_LENGTH,
  IMAGE_EXTENSION,
  MAX_IMAGE_SIZE_MB,
  MAX_TAG_COUNT,
  TAG_REGEXP,
  TITLE_MAX_LENGTH,
} from '~app/constants/validation';
import {isValidHttpUrl} from '~app/utilities/url';
import {OpinionService} from '~app/services/opinion/opinion.service';
import {ImageService} from '~app/services/image/image.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialogRef} from '@angular/material/dialog';
import {MutationResult} from 'apollo-angular';
import {CreateOpinionMutationResult, Opinion} from '~app/typings/opinion/opinion.interfaces';
import {Store} from '@ngxs/store';
import {PrependUserOpinion} from '~app/modules/user/store/user.actions';
import {hasExtension} from '~app/utilities/file';
import {OpinionSuccessSnackbarComponent} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.component';

@Component({
  selector: 'app-add-opinion-dialog',
  templateUrl: './add-opinion-dialog.component.html',
  styleUrls: ['./add-opinion-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOpinionDialogComponent implements OnInit, Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly options: Array<SelectItem> = [
    {title: 'Text', value: OpinionType.Text},
    {title: 'Image', value: OpinionType.Image},
  ];
  public readonly hashtagRegexp = TAG_REGEXP;
  public readonly titleMaxLength = TITLE_MAX_LENGTH;
  public readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;
  private readonly addOpinionForm = this.addOpinionFormGroup;

  public constructor(
    private readonly opinionService: OpinionService,
    private readonly imageService: ImageService,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<AddOpinionDialogComponent>,
    private readonly store: Store,
  ) {}

  public ngOnInit(): void {
    this.type.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.addOpinionForm.markAsUntouched();
      this.fileUrl.updateValueAndValidity();
      this.description.updateValueAndValidity();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public share(): void {
    this.addOpinionForm.markAllAsTouched();
    this.fileUrl.updateValueAndValidity();
    this.description.updateValueAndValidity();

    if (!this.addOpinionForm.valid) return;

    const {type, fileUrl, file, title, description, tags} = this.addOpinionForm.value;

    this.loading$.next(true);

    if (type === OpinionType.Image && file) {
      let thumbnail: string;

      this.imageService
        .uploadImage(file)
        .pipe(
          switchMap((result) => {
            if (!result.success) return throwError('');

            const isGif = result.data.image.extension === 'gif';
            thumbnail = isGif ? result.data.image.url : result.data.thumb.url;

            return this.opinionService.createOpinion({
              type,
              fileUrl: thumbnail,
              title,
              description,
              tags,
            });
          }),
          takeUntil(this.destroy$),
          finalize(() => {
            this.loading$.next(false);
          }),
        )
        .subscribe((result) => {
          if (!result.data?.createOpinion) return this.errorSnackbar();

          this.opinionShared(result, {
            id: result.data.createOpinion,
            type,
            file_url: thumbnail,
            title,
            description,
            tags,
          });
        }, this.errorSnackbar.bind(this));

      return;
    }

    this.opinionService
      .createOpinion({
        type,
        fileUrl,
        title,
        description,
        tags,
      })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.loading$.next(false);
        }),
      )
      .subscribe((result) => {
        if (!result.data?.createOpinion) return this.errorSnackbar();

        this.opinionShared(result, {
          id: result.data.createOpinion,
          type,
          file_url: fileUrl,
          title,
          description,
          tags,
        });
      }, this.errorSnackbar.bind(this));
  }

  public titleErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${TITLE_MAX_LENGTH} characters at max`;
  }

  public descriptionErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('maxlength' in errors) return `${this.descriptionMaxLength} characters at max`;

    return 'Required field';
  }

  public imageUrlErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('required' in errors) return 'Either set image url or upload image file';

    if ('size' in errors) return `Invalid image. File size exceeds ${MAX_IMAGE_SIZE_MB}MB`;

    if ('url' in errors) return 'Invalid image url';

    if ('type' in errors) return 'Invalid image. Unsupported type';

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  private imageValidator(control: UntypedFormControl | AbstractControl): ValidationErrors | null {
    if (this.addOpinionForm?.controls['type']?.value !== OpinionType.Image) return null;

    if (this.file.value) return null;

    if (!control.value && !this.file.value) return {required: true};

    if (!isValidHttpUrl(control.value)) return {url: true};

    if (!hasExtension(control.value, IMAGE_EXTENSION)) return {type: true};

    if (control.value.length > FILE_URL_MAX_LENGTH) return {maxlength: true};

    return null;
  }

  private fileSizeValidator(control: UntypedFormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((control.value as File).size / 1024 ** 2 > MAX_IMAGE_SIZE_MB) return {size: true};

    return null;
  }

  private descriptionValidator(control: UntypedFormControl | AbstractControl): ValidationErrors | null {
    if (this.addOpinionForm?.controls['type']?.value !== OpinionType.Text) return null;

    if (!control.value) return {required: true};

    return null;
  }

  private opinionShared({data}: MutationResult<CreateOpinionMutationResult>, opinion: Opinion): void {
    if (!data?.createOpinion) return this.errorSnackbar();

    this.snackbar.openFromComponent(OpinionSuccessSnackbarComponent, {
      data: data.createOpinion,
      panelClass: 'snackbar-success',
    });

    this.store.dispatch(new PrependUserOpinion(opinion));

    this.dialogRef.close();
  }

  private errorSnackbar(): void {
    this.snackbar.open('Something went wrong. Please try again later', 'OK', {panelClass: 'snackbar-error'});
  }

  public get type(): UntypedFormControl {
    return this.addOpinionForm.controls['type'] as UntypedFormControl;
  }

  public get title(): UntypedFormControl {
    return this.addOpinionForm.controls['title'] as UntypedFormControl;
  }

  public get fileUrl(): UntypedFormControl {
    return this.addOpinionForm.controls['fileUrl'] as UntypedFormControl;
  }

  public get file(): UntypedFormControl {
    return this.addOpinionForm.controls['file'] as UntypedFormControl;
  }

  public get description(): UntypedFormControl {
    return this.addOpinionForm.controls['description'] as UntypedFormControl;
  }

  public get tags(): UntypedFormControl {
    return this.addOpinionForm.controls['tags'] as UntypedFormControl;
  }

  public get imageSet(): boolean {
    return this.fileUrl.value || this.file.value;
  }

  public get hasImageErrorBorder(): boolean {
    return !this.file.value && this.fileUrl.touched && this.fileUrl.hasError('required');
  }

  public get imageType(): boolean {
    return this.type.value === OpinionType.Image;
  }

  private get addOpinionFormGroup(): UntypedFormGroup {
    return new UntypedFormGroup({
      type: new UntypedFormControl(OpinionType.Text),
      fileUrl: new UntypedFormControl(null, this.imageValidator.bind(this)),
      file: new UntypedFormControl(null, this.fileSizeValidator.bind(this)),
      title: new UntypedFormControl(null, Validators.maxLength(TITLE_MAX_LENGTH)),
      description: new UntypedFormControl(null, [
        Validators.maxLength(this.descriptionMaxLength),
        this.descriptionValidator.bind(this),
      ]),
      tags: new UntypedFormControl([], Validators.maxLength(MAX_TAG_COUNT)),
    });
  }
}
