import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, finalize, Subject, switchMap, takeUntil, throwError} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {
  DESCRIPTION_MAX_LENGTH,
  MAX_IMAGE_SIZE_MB,
  MAX_TAG_COUNT,
  TAG_REGEXP,
  TITLE_MAX_LENGTH,
} from '~app/constants/validation';
import {UserOpinionService} from '~app/services/user-opinion/user-opinion.service';
import {ImageService} from '~app/services/image/image.service';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {MatLegacyDialogModule, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {MutationResult} from 'apollo-angular';
import {CreateOpinionMutationResult, UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {Store} from '@ngxs/store';
import {PrependUserOpinion} from '~app/modules/user/store/user.actions';
import {OpinionSuccessSnackbarComponent} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.component';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {InputComponent} from '~app/shared/components/input/input.component';
import {AsyncPipe, NgIf} from '@angular/common';
import {TextareaComponent} from '~app/shared/components/textarea/textarea.component';
import {ChipsComponent} from '~app/shared/components/chips/chips.component';
import {ImageBrowserComponent} from '~app/shared/components/image-browser/image-browser.component';
import {ProgressBarComponent} from '~app/shared/components/progress-bar/progress-bar.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';

@Component({
  selector: 'app-add-opinion-dialog',
  templateUrl: './add-opinion-dialog.component.html',
  styleUrls: ['./add-opinion-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    MatLegacyDialogModule,
    InputComponent,
    TextareaComponent,
    ChipsComponent,
    ImageBrowserComponent,
    ProgressBarComponent,
    ButtonComponent,
  ],
})
export class AddOpinionDialogComponent implements Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly hashtagRegexp = TAG_REGEXP;
  public readonly titleMaxLength = TITLE_MAX_LENGTH;
  public readonly descriptionMaxLength = DESCRIPTION_MAX_LENGTH;
  private readonly addOpinionForm = this.addOpinionFormGroup;

  public constructor(
    private readonly userOpinionService: UserOpinionService,
    private readonly imageService: ImageService,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<AddOpinionDialogComponent>,
    private readonly store: Store,
  ) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public share(): void {
    this.addOpinionForm.markAllAsTouched();
    this.description.updateValueAndValidity();

    if (!this.addOpinionForm.valid) return;

    const {file, title, description, tags} = this.addOpinionForm.value;
    const type = file?.size ? OpinionType.Image : OpinionType.Text;

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

            return this.userOpinionService.createOpinion({
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

    this.userOpinionService
      .createOpinion({
        type,
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
          file_url: '',
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

  public imageFileErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `Invalid image. File size exceeds ${MAX_IMAGE_SIZE_MB}MB`;
  }

  private fileSizeValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((control.value as File).size / 1024 ** 2 > MAX_IMAGE_SIZE_MB) return {size: true};

    return null;
  }

  private descriptionValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (this.addOpinionForm?.controls['type']?.value !== OpinionType.Text) return null;

    if (!control.value) return {required: true};

    return null;
  }

  private opinionShared({data}: MutationResult<CreateOpinionMutationResult>, opinion: UserOpinion): void {
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

  public get title(): FormControl {
    return this.addOpinionForm.controls['title'] as FormControl;
  }

  public get file(): FormControl {
    return this.addOpinionForm.controls['file'] as FormControl;
  }

  public get description(): FormControl {
    return this.addOpinionForm.controls['description'] as FormControl;
  }

  public get tags(): FormControl {
    return this.addOpinionForm.controls['tags'] as FormControl;
  }

  private get addOpinionFormGroup(): FormGroup {
    return new FormGroup({
      // type: new FormControl(OpinionType.Text),
      // fileUrl: new FormControl(null, this.imageValidator.bind(this)),
      file: new FormControl(null, this.fileSizeValidator.bind(this)),
      title: new FormControl(null, Validators.maxLength(TITLE_MAX_LENGTH)),
      description: new FormControl(null, [
        Validators.maxLength(this.descriptionMaxLength),
        this.descriptionValidator.bind(this),
      ]),
      tags: new FormControl([], Validators.maxLength(MAX_TAG_COUNT)),
    });
  }
}
