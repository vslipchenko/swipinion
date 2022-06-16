import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {OpinionType} from '~app/typings/opinion/opinion.enums';

@Component({
  selector: 'app-opinion-preview',
  templateUrl: './opinion-preview.component.html',
  styleUrls: ['./opinion-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionPreviewComponent {
  @Input() public type: OpinionType = OpinionType.Text;
  @Input() public title = '';
  @Input() public description = '';
  @Input() public fileUrl = '';
  @Input() public tags: Array<string> = [];

  public readonly stats = [
    {icon: 'thumb_up', value: 12},
    {icon: 'thumb_down', value: 10},
    {svgIcon: 'like-n-comment', value: 10},
    {svgIcon: 'dislike-n-comment', value: 10},
    // {icon: 'visibility', value: 14},
  ];

  // public get isPng(): boolean {
  //   return true;
  // }

  public get setImage(): boolean {
    return Boolean(this.type === OpinionType.Image && this.fileUrl);
  }
}
