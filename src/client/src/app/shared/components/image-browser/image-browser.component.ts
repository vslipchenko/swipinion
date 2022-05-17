import {ChangeDetectionStrategy, Component, Input, OnDestroy} from '@angular/core';
import {FormControl} from '@angular/forms';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-image-browser',
  templateUrl: './image-browser.component.html',
  styleUrls: ['./image-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageBrowserComponent implements OnDestroy {
  @Input() public imageUrl = new FormControl();
  @Input() public file = new FormControl();

  public imagePreview: SafeUrl | null = '';
  public recentObjectUrl = '';

  public constructor(private readonly domSanitizer: DomSanitizer) {}

  public ngOnDestroy(): void {
    URL.revokeObjectURL(this.recentObjectUrl);
  }

  public setImagePreview(file: File | void): void {
    if (file) {
      this.recentObjectUrl = URL.createObjectURL(file);
      this.imagePreview = this.domSanitizer.bypassSecurityTrustUrl(this.recentObjectUrl);
      return;
    }

    URL.revokeObjectURL(this.recentObjectUrl); // Free up memory
    this.imagePreview = null;
  }

  public resetPreviewImage(): void {
    this.imageUrl.setValue(null);
  }

  public get imageSet(): boolean {
    return this.imageUrl.value || this.imagePreview;
  }
}
