import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {BehaviorSubject, finalize, Subject, takeUntil} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidationErrors, Validators} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {SelectItem} from '~app/typings/select/select.interfaces';
import {
  TAG_REGEXP,
  FILE_URL_MAX_LENGTH,
  MAX_IMAGE_SIZE_MB,
  MAX_TAG_COUNT,
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
} from '~app/constants/validation';
import {isValidHttpUrl} from '~app/utilities/url';
import {OpinionService} from '~app/services/opinion/opinion.service';

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

  public constructor(private readonly opinionService: OpinionService) {}

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

    this.loading$.next(true);

    const {type, fileUrl, title, description, tags} = this.addOpinionForm.value;

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
        finalize(() => this.loading$.next(false)),
      )
      .subscribe(({data}) => {
        console.log(data);
      });
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

    if ('url' in errors) return 'Invalid image url';

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  private imageValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (this.addOpinionForm?.controls['type']?.value !== OpinionType.Image) return null;

    if (this.file.value) return null;

    if (!control.value && !this.file.value) return {required: true};

    if (!isValidHttpUrl(control.value)) return {url: true};

    if (control.value.length > FILE_URL_MAX_LENGTH) return {maxlength: true};

    return null;
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

  public get type(): FormControl {
    return this.addOpinionForm.controls['type'] as FormControl;
  }

  public get title(): FormControl {
    return this.addOpinionForm.controls['title'] as FormControl;
  }

  public get fileUrl(): FormControl {
    return this.addOpinionForm.controls['fileUrl'] as FormControl;
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

  public get imageSet(): boolean {
    return this.fileUrl.value || this.file.value;
  }

  public get hasImageErrorBorder(): boolean {
    return !this.file.value && this.fileUrl.touched && this.fileUrl.hasError('required');
  }

  public get imageType(): boolean {
    return this.type.value === OpinionType.Image;
  }

  private get addOpinionFormGroup(): FormGroup {
    return new FormGroup({
      type: new FormControl(OpinionType.Text),
      fileUrl: new FormControl(null, this.imageValidator.bind(this)),
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
