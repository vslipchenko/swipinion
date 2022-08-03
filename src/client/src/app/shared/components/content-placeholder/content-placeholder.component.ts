import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-content-placeholder',
  templateUrl: './content-placeholder.component.html',
  styleUrls: ['./content-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentPlaceholderComponent {
  @Input() public icon = '';
  @Input() public svgIcon = '';
  @Input() public text = '';
  @Input() public tip = '';
  @Input() public border = true;
  @Input() public gradient = true;
}
