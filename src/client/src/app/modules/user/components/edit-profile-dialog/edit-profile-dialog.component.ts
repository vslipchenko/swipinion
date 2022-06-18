import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';
import {FILE_URL_MAX_LENGTH, MAX_IMAGE_SIZE_MB} from '~app/constants/validation';
import {BehaviorSubject} from 'rxjs';
import {isValidHttpUrl} from '~app/utilities/url';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialogComponent {
  @Input() public imageUrl = new FormControl(null, this.imageValidator.bind(this));
  @Input() public file = new FormControl(null, this.fileSizeValidator.bind(this));
  @Input() public description = new FormControl();

  public readonly loading$ = new BehaviorSubject(false);

  public imageUrlErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('url' in errors) return 'Invalid image url';

    if ('size' in errors) return `Invalid image. File size exceeds ${MAX_IMAGE_SIZE_MB}MB`;

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  public descriptionErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('maxlength' in errors) return `${300} characters at max`;

    return 'Required field';
  }

  public save(): void {
    console.log(this.imageUrl, this.file);
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
