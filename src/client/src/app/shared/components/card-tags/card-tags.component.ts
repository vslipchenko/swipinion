import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'app-card-tags',
  templateUrl: './card-tags.component.html',
  styleUrls: ['./card-tags.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardTagsComponent {
  @Input() public tags: Array<string> = [];
}
