import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {UntypedFormControl, ValidationErrors} from '@angular/forms';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageBrowserComponent implements OnDestroy {
  @Input() public imageUrl = new UntypedFormControl();
  @Input() public file = new UntypedFormControl();
  @Input() public imageUrlErrorMessage!: (errors: ValidationErrors | null) => string | void;
  @Input() public extendClass = '';

  public imagePreview: SafeUrl | null = '';
  public recentObjectUrl = '';

  public constructor(private readonly domSanitizer: DomSanitizer) {}

  public ngOnDestroy(): void {
    URL.revokeObjectURL(this.recentObjectUrl);
  }

  public setImagePreview(file: File | void): void {
    this.file.markAsDirty();

    if (file) {
      this.recentObjectUrl = URL.createObjectURL(file);
      this.imagePreview = this.domSanitizer.bypassSecurityTrustUrl(this.recentObjectUrl);
      return;
    }

    URL.revokeObjectURL(this.recentObjectUrl); // Free up memory
    this.imagePreview = null;
  }

  public resetImageUrl(): void {
    this.imageUrl.setValue(null);
    this.imageUrl.markAsDirty();
  }

  public get valueSet(): boolean {
    return this.imageUrl.value || this.imagePreview;
  }

  public get imageUrlSet(): boolean {
    return this.imageUrl.value && this.imageUrl.valid;
  }

  public get imageSet(): boolean {
    return Boolean(this.imagePreview) || this.imageUrlSet;
  }
}
