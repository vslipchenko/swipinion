import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {AddOpinionToFavoritesFailReason, OpinionReaction, OpinionType} from '~app/typings/opinion/opinion.enums';
import {OpinionsSelectors} from '~app/modules/opinions/store/opinions.selectors';
import {Subject, takeUntil} from 'rxjs';
import {Actions, ofActionCompleted, Store} from '@ngxs/store';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {OpinionMenuItem} from '~app/typings/menu/menu.enums';
import {MenuItem} from '~app/typings/menu/menu.interfaces';
import {AddOpinionToFavorites} from '~app/modules/opinions/store/opinions.actions';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';
import {OpinionFailSnackbarComponent} from '~app/modules/opinions/components/opinion-fail-snackbar/opinion-fail-snackbar.component';

@Component({
  selector: 'app-opinion-card',
  templateUrl: './opinion-card.component.html',
  styleUrls: ['./opinion-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OpinionCardComponent implements OnInit, Destroyable {
  @Input() public id = '';
  @Input() public username = '';
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
      id: OpinionMenuItem.AddToFavorites,
      title: 'Add to Favorites',
      icon: 'star',
      click: (): void => this.addToFavorites(),
    },
  ] as Array<MenuItem>;

  // private readonly activeOpinion$!: Observable<CarouselOpinion>;

  public constructor(
    private readonly store: Store,
    private readonly actions$: Actions,
    private readonly snackbar: MatSnackBar,
  ) {
    this.actions$.pipe(takeUntil(this.destroy$), ofActionCompleted(AddOpinionToFavorites)).subscribe((completion) => {
      if (completion.result.error?.message === AddOpinionToFavoritesFailReason.UniqueViolation) {
        // Show Opinion is already added to Favorites error
        this.snackbar.openFromComponent(OpinionFailSnackbarComponent, {
          data: `<span class="fw-medium">${completion.action.payload.username}</span>'s opinion was already added to Favorites`,
          panelClass: 'snackbar-error',
        });
      } else if (completion.result.error) {
        // Show generic error
        this.snackbar.openFromComponent(OpinionFailSnackbarComponent, {
          data: `Something went wrong adding <span class="fw-medium">${completion.action.payload.username}</span>'s opinion to Favorites`,
          panelClass: 'snackbar-error',
        });
      }
    });

    this.store
      .select(OpinionsSelectors.opinionReaction)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.id !== value.opinionId) return;

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
