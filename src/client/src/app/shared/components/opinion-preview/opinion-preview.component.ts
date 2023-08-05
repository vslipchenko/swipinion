import {ChangeDetectionStrategy, Component, EventEmitter, Injector, Input, Output} from '@angular/core';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {Store} from '@ngxs/store';
import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';
import {AsyncPipe, NgIf} from '@angular/common';
import {CardTagsComponent} from '~app/shared/components/card-tags/card-tags.component';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {MenuItemsComponent} from '~app/shared/components/menu-items/menu-items.component';
import {MatLegacyMenuModule as MatMenuModule} from '@angular/material/legacy-menu';
import {RouterLink} from '@angular/router';
import {OpinionStatsPanelComponent} from '~app/shared/components/opinion-stats-panel/opinion-stats-panel.component';
import {copyOpinionLink} from '~app/utilities/opinion';
import {BehaviorSubject} from 'rxjs';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserRole} from '~app/typings/user/user.enums';
import {authClickGuard} from '~app/utilities/guard';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {AddOpinionToFavorites} from '~app/modules/app/store/app.actions';

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
    AsyncPipe,
  ],
})
export class OpinionPreviewComponent {
  @Output() public deleteOpinion = new EventEmitter<string>();

  @Input() public id = '';
  @Input() public type: OpinionType = OpinionType.Text;
  @Input() public body = '';
  @Input() public fileUrl = '';
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public commented = false;
  @Input() public tags: Array<string> = [];

  @Input()
  public set reaction(reaction: OpinionReaction | null) {
    if (reaction === OpinionReaction.Agree) this.highlightAgreed = true;
    else if (reaction === OpinionReaction.Disagree) this.highlightDisagreed = true;
  }

  protected highlightAgreed = false;
  protected highlightDisagreed = false;

  protected readonly opinionItems$: BehaviorSubject<Array<MenuItem>> = new BehaviorSubject(
    this.opinionMenuItemsInitialValue,
  );

  public constructor(private readonly store: Store, private readonly injector: Injector) {}

  private addToFavorites(): void {
    const username = this.store.selectSnapshot(UserSelectors.resolvedUserUsername);
    // TODO fix not being dispatched
    this.store.dispatch(new AddOpinionToFavorites({opinionId: this.id, username}));
  }

  private get opinionMenuItemsInitialValue(): Array<MenuItem> {
    const menuItems: Array<MenuItem> = [
      {
        title: 'Add to Favorites',
        icon: 'star_outlined',
        click: authClickGuard(this.addToFavorites.bind(this), this.injector),
      },
      {
        title: 'Copy link',
        icon: 'content_copy',
        click: (): void => {
          copyOpinionLink(this.injector, this.id);
        },
      },
    ];

    const canDelete = this.store.selectSnapshot(AppSelectors.userRole) === UserRole.User;

    if (canDelete)
      menuItems.push({
        title: 'Delete opinion',
        icon: 'delete',
        color: 'warn',
        click: () => this.deleteOpinion.emit(this.id),
      });

    return menuItems;
  }
}
