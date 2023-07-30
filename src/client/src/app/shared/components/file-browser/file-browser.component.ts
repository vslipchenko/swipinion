import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl} from '@angular/forms';
import {NgIf} from '@angular/common';
import {FlatButtonComponent} from '~app/shared/components/flat-button/flat-button.component';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgIf, FlatButtonComponent],
})
export class FileBrowserComponent implements OnDestroy {
  @Input() public control = new FormControl();
  @Input() public browseText = 'Browse';
  @Input() public accept: Array<string> = [];
  @Output() public fileChange = new EventEmitter<File | void>();

  private fileInput = this.fileInputElement;

  public ngOnDestroy(): void {
    this.fileInput.remove();
  }

  protected browse(): void {
    this.reinstantiateFileInput(); // Fixes onchange triggering for the same image upload on subsequent reset
    this.fileInput.click();
  }

  protected reset(): void {
    this.control.setValue(null);
    this.fileChange.emit();
  }

  private reinstantiateFileInput(): void {
    this.fileInput.remove();
    this.fileInput = this.fileInputElement;
  }

  private get fileInputElement(): HTMLInputElement {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = this.accept.join();
    fileInput.onchange = (): void => {
      const file = fileInput.files?.[0];

      if (!(file && this.accept.includes(file.type))) return;

      this.control.setValue(file);
      this.fileChange.emit(file);
    };

    return fileInput;
  }
}
