import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {Store} from '@ngxs/store';
import {DeleteUserOpinion} from '~app/modules/user/store/user.actions';

@Component({
  selector: 'app-opinion-preview',
  templateUrl: './opinion-preview.component.html',
  styleUrls: ['./opinion-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionPreviewComponent {
  @Input() public id = '';
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

  public readonly opinionItems: Array<MenuItem> = [
    {
      title: 'Delete',
      icon: 'delete',
      color: 'warn',
      click: this.deleteOpinion.bind(this),
    },
  ];

  public constructor(private readonly store: Store) {}

  private deleteOpinion(opinionId: string): void {
    this.store.dispatch(new DeleteUserOpinion(opinionId));
  }
}
