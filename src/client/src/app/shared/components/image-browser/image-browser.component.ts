import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {FormControl, ValidationErrors} from '@angular/forms';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {NgIf} from '@angular/common';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {FileBrowserComponent} from '~app/shared/components/file-browser/file-browser.component';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, FlatButtonComponent, MatFormFieldModule, FileBrowserComponent],
})
export class ImageBrowserComponent implements OnDestroy {
  @Input() public imageUrl = new FormControl();
  @Input() public file = new FormControl();
  @Input() public browseText = '';
  @Input() public errorMessage!: (errors: ValidationErrors | null) => string | void;
  @Input() public extendClass = '';

  protected imagePreview: SafeUrl | null = '';
  private recentObjectUrl = '';

  public constructor(private readonly domSanitizer: DomSanitizer) {}

  public ngOnDestroy(): void {
    URL.revokeObjectURL(this.recentObjectUrl);
  }

  protected setImagePreview(file: File | void): void {
    this.file.markAsDirty();

    if (file) {
      this.recentObjectUrl = URL.createObjectURL(file);
      this.imagePreview = this.domSanitizer.bypassSecurityTrustUrl(this.recentObjectUrl);
      return;
    }

    URL.revokeObjectURL(this.recentObjectUrl); // Free up memory
    this.imagePreview = null;
  }

  protected resetImageUrl(): void {
    this.imageUrl.setValue(null);
    this.imageUrl.markAsDirty();
  }

  protected get imageUrlSet(): boolean {
    return this.imageUrl.value && this.imageUrl.valid;
  }

  protected get imageSet(): boolean {
    return Boolean(this.imagePreview) || this.imageUrlSet;
  }
}
