import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {AbstractControl, FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {SelectItem} from '~app/typings/select/select.interfaces';
import {HASHTAG_REGEXP, MAX_IMAGE_SIZE_MB} from '~app/constants/validation';

@Component({
  selector: 'app-add-opinion-dialog',
  templateUrl: './add-opinion-dialog.component.html',
  styleUrls: ['./add-opinion-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddOpinionDialogComponent implements Destroyable {
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly options: Array<SelectItem> = [
    {title: 'Text', value: OpinionType.Text},
    {title: 'Image', value: OpinionType.Image},
  ];
  public readonly hashtagRegexp = HASHTAG_REGEXP;
  private readonly addOpinionForm = this.addOpinionFormGroup;

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public share(): void {
    console.log(this.addOpinionForm.valid, this.addOpinionForm);
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  private fileSizeValidator(control: FormControl | AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    if ((control.value as File).size / 1024 ** 2 > MAX_IMAGE_SIZE_MB) return {size: true};

    return null;
  }

  public get type(): FormControl {
    return this.addOpinionForm.controls['type'] as FormControl;
  }

  public get title(): FormControl {
    return this.addOpinionForm.controls['title'] as FormControl;
  }

  public get imageUrl(): FormControl {
    return this.addOpinionForm.controls['imageUrl'] as FormControl;
  }

  public get file(): FormControl {
    return this.addOpinionForm.controls['file'] as FormControl;
  }

  public get description(): FormControl {
    return this.addOpinionForm.controls['description'] as FormControl;
  }

  public get imageSet(): boolean {
    return this.imageUrl.value || this.file.value;
  }

  private get addOpinionFormGroup(): FormGroup {
    return new FormGroup({
      type: new FormControl(OpinionType.Image),
      imageUrl: new FormControl(),
      file: new FormControl(null, this.fileSizeValidator.bind(this)), // TODO Validate file size <= 30MB
      title: new FormControl(),
      description: new FormControl(),
      tags: new FormControl(),
    });
  }
}
