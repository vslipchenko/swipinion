import {ChangeDetectionStrategy, Component, Injector, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Subject} from 'rxjs';
import {Store} from '@ngxs/store';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {authClickGuard} from '~app/utilities/guard';
import {copyOpinionLink} from '~app/utilities/opinion';
import {untilDestroyed} from '~app/utilities/operator';
import {AddOpinionToFavorites, RemoveOpinionFromFavorites} from '~app/modules/opinions/store/opinions.actions';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCardComponent implements OnInit, OnChanges {
  @Input() public id = '';
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public type = OpinionType.Text;
  @Input() public fileUrl = '';
  @Input() public body = '';
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public favorite = false;
  @Input() public tags: Array<string> = [];

  protected textContent = false;
  protected textBackground = false;
  protected backgroundUrl = '';
  protected updateStatistic = new Subject<{
    reaction: OpinionReaction;
    commented: boolean;
    agreed: number;
    disagreed: number;
    comments: number;
  }>();

  protected opinionMenuItems = [] as Array<MenuItem>;

  // private readonly activeOpinion$!: Observable<CarouselOpinion>;
  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly store: Store, private readonly injector: Injector) {
    this.store
      .select(OpinionsSelectors.opinionReaction)
      .pipe(this.untilDestroyed())
      .subscribe((value) => {
        if (this.id !== value.opinionId) return; // Ignore if not active opinion

        if (value.reaction === OpinionReaction.Skip) return; // Skip does not impact opinion's statistic

        const {agreed, disagreed, comments} = this.store.selectSnapshot(OpinionsSelectors.activeOpinion);

        this.updateStatistic.next({reaction: value.reaction, commented: value.commented, agreed, disagreed, comments});
      });
  }

  public ngOnInit(): void {
    if (this.body || this.tags.length) this.textContent = true;

    if (this.fileUrl) {
      this.backgroundUrl = `url('${this.fileUrl}')`;
    } else if (this.body) {
      // assume OpinionType = Text
      this.textBackground = true;
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (!changes['favorite']) return;

    this.opinionMenuItems = this.menuItems;
  }

  private addToFavorites(): void {
    this.store.dispatch(new AddOpinionToFavorites({opinionId: this.id, username: this.username}));
  }

  private removeFromFavorites(): void {
    this.store.dispatch(new RemoveOpinionFromFavorites({opinionId: this.id, username: this.username}));
  }

  private get menuItems(): Array<MenuItem> {
    const favoritesMenuItem = this.favorite
      ? {
          title: 'Remove from Favorites',
          icon: 'star',
          click: this.removeFromFavorites.bind(this),
        }
      : {
          title: 'Add to Favorites',
          icon: 'star_outlined',
          click: authClickGuard(this.addToFavorites.bind(this), this.injector),
        };

    return [
      favoritesMenuItem,
      {
        title: 'Copy link',
        icon: 'content_copy',
        click: (): void => {
          copyOpinionLink(this.injector, this.id);
        },
      },
    ];
  }
}
