import {ChangeDetectionStrategy, Component} from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';
import {FormControl, FormGroup, ValidationErrors} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {SelectItem} from '~app/typings/select/select.interfaces';

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
  private readonly addOpinionForm = this.addOpinionFormGroup;

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
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
      file: new FormControl(),
      title: new FormControl(),
      description: new FormControl(),
      tags: new FormControl(),
    });
  }
}
