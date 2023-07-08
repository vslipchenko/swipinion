import {ChangeDetectionStrategy, Component, Injector, Input} from '@angular/core';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {Store} from '@ngxs/store';
import {DeleteUserOpinion} from '~app/modules/user/store/user.actions';
import {OpinionType} from '~app/typings/opinion/opinion.enums';
import {NgIf} from '@angular/common';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {RouterLink} from '@angular/router';
import {OpinionStatsPanelComponent} from '~app/shared/components/opinion-stats-panel/opinion-stats-panel.component';
import {copyOpinionLink} from '~app/utilities/opinion';

@Component({
  selector: 'app-opinion-preview',
  templateUrl: './opinion-preview.component.html',
  styleUrls: ['./opinion-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    CardTagsComponent,
    ButtonComponent,
    MenuItemsComponent,
    OpinionStatsPanelComponent,
    MatMenuModule,
  ],
})
export class OpinionPreviewComponent {
  @Input() public id = '';
  @Input() public type: OpinionType = OpinionType.Text;
  @Input() public body = '';
  @Input() public fileUrl = '';
  @Input() public tags: Array<string> = [];

  public readonly stats = [
    {icon: 'thumb_up', value: '12'},
    {icon: 'thumb_down', value: '10'},
    // {icon: 'chat_bubble', value: 10},
    // {svgIcon: 'message-outline', value: 10},
    // {svgIcon: 'comment', value: 10},
    {svgIcon: 'comment-outline', value: '10'},
    // {icon: 'visibility', value: 14},
  ];

  public readonly opinionItems: Array<MenuItem> = [
    {
      title: 'Copy link',
      icon: 'content_copy',
      click: (): void => {
        copyOpinionLink(this.injector, this.id);
      },
    },
    {
      title: 'Delete opinion',
      icon: 'delete',
      color: 'warn',
      click: this.deleteOpinion.bind(this),
    },
  ];

  public constructor(private readonly store: Store, private readonly injector: Injector) {}

  private deleteOpinion(opinionId: string): void {
    this.store.dispatch(new DeleteUserOpinion(opinionId));
  }
}
