import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-file-browser',
  templateUrl: './file-browser.component.html',
  styleUrls: ['./file-browser.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FileBrowserComponent implements OnDestroy {
  @Input() public control = new FormControl();

  @Output() public fileChange = new EventEmitter<File | void>();

  private readonly accept = ['image/jpeg', 'image/png'];
  private readonly fileInput = this.fileInputElement;

  public ngOnDestroy(): void {
    this.fileInput.remove();
  }

  public browse(): void {
    this.fileInput.click();
  }

  public reset(): void {
    this.control.setValue(null);
    this.fileChange.emit();
  }

  private get fileInputElement(): HTMLInputElement {
    const fileInput = document.createElement('input');

    fileInput.type = 'file';
    fileInput.accept = this.accept.join(',');
    fileInput.onchange = (): void => {
      const file = fileInput.files?.[0];

      if (!(file && this.accept.includes(file.type))) return;

      this.control.setValue(file);
      this.fileChange.emit(file);
    };

    return fileInput;
  }
}
