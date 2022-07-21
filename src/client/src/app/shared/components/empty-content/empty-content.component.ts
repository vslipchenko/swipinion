import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';

@Component({
  selector: 'app-empty-content',
  templateUrl: './empty-content.component.html',
  styleUrls: ['./empty-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyContentComponent {
  @Input() public icon = '';
  @Input() public text = '';

  public constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    this.changeDetector.detach();
  }
}
