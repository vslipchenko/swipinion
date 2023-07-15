import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, finalize, map, Observable, startWith, switchMap, throwError} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {untilDestroyed} from '~app/utilities/operator';
import {MAX_IMAGE_SIZE_MB, MAX_TAG_COUNT, OPINION_BODY_MAX_LENGTH, TAG_REGEXP} from '~app/constants/validation';
import {UserOpinionService} from '~app/services/user-opinion/user-opinion.service';
import {ImageService} from '~app/services/image/image.service';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {MatLegacyDialogModule, MatLegacyDialogRef as MatDialogRef} from '@angular/material/legacy-dialog';
import {UserOpinion} from '~app/typings/user-opinion/user-opinion.interfaces';
import {Store} from '@ngxs/store';
import {PrependUserOpinion} from '~app/modules/user/store/user.actions';
import {OpinionSuccessSnackbarComponent} from '~app/shared/components/opinion-success-snackbar/opinion-success-snackbar.component';
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
export class AddOpinionDialogComponent {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly hashtagRegexp = TAG_REGEXP;
  // public readonly titleMaxLength = TITLE_MAX_LENGTH;
  public readonly bodyMaxLength = OPINION_BODY_MAX_LENGTH;
  protected readonly disableAddOpinion$: Observable<boolean>;
  private readonly addOpinionForm = this.addOpinionFormGroup;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly userOpinionService: UserOpinionService,
    private readonly imageService: ImageService,
    private readonly snackbar: MatSnackBar,
    private readonly dialogRef: MatDialogRef<AddOpinionDialogComponent>,
    private readonly store: Store,
  ) {
    this.disableAddOpinion$ = this.addOpinionForm.valueChanges.pipe(
      startWith(this.addOpinionForm.value),
      map(({body, file}) => this.loading$.value || (!body?.trim() && !file?.size)),
    );
  }

  public ngOnDestroy(): void {
    this.loading$.complete();
  }

  public addOpinion(): void {
    this.addOpinionForm.markAllAsTouched();

    if (!this.addOpinionForm.valid) return;

    const {file, body, tags} = this.addOpinionForm.value;

    this.loading$.next(true);

    if (file?.size) {
      // Add Image/TextImage opinion
      let thumbnail: string;

      this.imageService
        .uploadImage(file)
        .pipe(
          switchMap((result) => {
            if (!result.success) return throwError('');

            const isGif = result.data.image.extension === 'gif';
            thumbnail = isGif ? result.data.image.url : result.data.thumb.url;

            return this.userOpinionService.createOpinion({
              fileUrl: thumbnail,
              body: body?.trim() || null,
              tags,
            });
          }),
          this.untilDestroyed(),
          finalize(() => {
            this.loading$.next(false);
          }),
        )
        .subscribe(({data}) => {
          if (!data?.createOpinion) return this.errorSnackbar();

          this.opinionAdded({
            ...data.createOpinion,
            file_url: thumbnail,
            body,
            tags,
            reaction: null,
            commented: false,
            agreed: 0,
            disagreed: 0,
            comments: 0,
          });
        }, this.errorSnackbar.bind(this));

      return;
    }
    // Add text opinion
    this.userOpinionService
      .createOpinion({
        body,
        tags,
      })
      .pipe(
        this.untilDestroyed(),
        finalize(() => {
          this.loading$.next(false);
        }),
      )
      .subscribe(({data}) => {
        if (!data?.createOpinion) return this.errorSnackbar();

        this.opinionAdded({
          ...data.createOpinion,
          file_url: '',
          body,
          tags,
          reaction: null,
          commented: false,
          agreed: 0,
          disagreed: 0,
          comments: 0,
        });
      }, this.errorSnackbar.bind(this));
  }

  public bodyErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return `${this.bodyMaxLength} characters at max`; // Assume 'maxlength'
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

  private opinionAdded(opinion: UserOpinion): void {
    this.snackbar.openFromComponent(OpinionSuccessSnackbarComponent, {
      data: opinion.id,
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

  public get body(): FormControl {
    return this.addOpinionForm.controls['body'] as FormControl;
  }

  public get tags(): FormControl {
    return this.addOpinionForm.controls['tags'] as FormControl;
  }

  private get addOpinionFormGroup(): FormGroup {
    return new FormGroup({
      // type: new FormControl(OpinionType.Text),
      // fileUrl: new FormControl(null, this.imageValidator.bind(this)),
      file: new FormControl(null, this.fileSizeValidator.bind(this)),
      // title: new FormControl(null, Validators.maxLength(TITLE_MAX_LENGTH)),
      body: new FormControl(null, Validators.maxLength(this.bodyMaxLength)),
      tags: new FormControl([], Validators.maxLength(MAX_TAG_COUNT)),
    });
  }
}
