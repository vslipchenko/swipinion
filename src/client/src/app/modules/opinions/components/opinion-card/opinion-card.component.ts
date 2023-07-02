import {ChangeDetectionStrategy, Component, Injector, Input, OnInit} from '@angular/core';
import {OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Subject, takeUntil} from 'rxjs';
import {Store} from '@ngxs/store';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {AddOpinionToFavorites} from '~app/modules/opinions/store/opinions.actions';
import {authClickGuard} from '~app/utilities/guard';
import {copyOpinionLink} from '~app/utilities/opinion';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCardComponent implements OnInit, Destroyable {
  @Input() public id = '';
  @Input() public username = '';
  @Input() public thumbnail = '';
  @Input() public type = OpinionType.Text;
  @Input() public fileUrl = '';
  @Input() public body = '';
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public tags: Array<string> = [];

  public readonly destroy$ = new Subject<void>();

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

  protected readonly opinionMenuItems = [
    {
      // id: OpinionMenuItem.AddToFavorites,
      title: 'Add to Favorites',
      icon: 'star_outlined',
      click: authClickGuard(this.addToFavorites.bind(this), this.injector),
    },
    {
      // id: OpinionMenuItem.CopyLink,
      title: 'Copy link',
      icon: 'content_copy',
      click: (): void => {
        copyOpinionLink(this.injector, this.id);
      },
    },
  ] as Array<MenuItem>;

  // private readonly activeOpinion$!: Observable<CarouselOpinion>;

  public constructor(private readonly store: Store, private readonly injector: Injector) {
    this.store
      .select(OpinionsSelectors.opinionReaction)
      .pipe(takeUntil(this.destroy$))
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

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected addToFavorites(): void {
    this.store.dispatch(new AddOpinionToFavorites({opinionId: this.id, username: this.username}));
  }
}
