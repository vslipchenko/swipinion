import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-empty-content',
  templateUrl: './empty-content.component.html',
  styleUrls: ['./empty-content.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyContentComponent {
  @Input() public icon = '';
  @Input() public text = '';
  @Input() public tip = '';
}
