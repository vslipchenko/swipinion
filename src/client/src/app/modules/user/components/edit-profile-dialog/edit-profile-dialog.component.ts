import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {FILE_URL_MAX_LENGTH} from '~app/constants/validation';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-edit-profile-dialog',
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditProfileDialogComponent {
  @Input() public imageUrl = new FormControl();
  @Input() public file = new FormControl();
  @Input() public description = new FormControl();

  public readonly loading$ = new BehaviorSubject(false);

  public imageUrlErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('required' in errors) return 'Either set image url or upload image file';

    if ('url' in errors) return 'Invalid image url';

    return `${FILE_URL_MAX_LENGTH} characters at max. Consider to use url shortener`;
  }

  public descriptionErrorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    if ('maxlength' in errors) return `${300} characters at max`;

    return 'Required field';
  }
}
