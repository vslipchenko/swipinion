import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {NgForOf} from '@angular/common';
import {Subject} from 'rxjs';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {untilDestroyed} from '~app/utilities/operator';
import {formatStatisticNumber} from '~app/utilities/number';

@Component({
  selector: 'app-opinion-stats-panel',
  templateUrl: './opinion-stats-panel.component.html',
  styleUrls: ['./opinion-stats-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, ButtonComponent],
})
export class OpinionStatsPanelComponent implements AfterViewInit {
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public buttonClass = '';
  @Input() public highlightAgreed = false;
  @Input() public highlightDisagreed = false;
  @Input() public highlightComment = false;
  @Input() public updateStatistic?: Subject<{
    reaction: OpinionReaction;
    commented: boolean;
    agreed: number;
    disagreed: number;
    comments: number;
  }>;

  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    if (this.updateStatistic)
      this.updateStatistic
        .pipe(this.untilDestroyed())
        .subscribe(({reaction, commented, agreed, disagreed, comments}) => {
          if (reaction === OpinionReaction.Agree) {
            this.highlightAgreed = true;
            this.agreed = formatStatisticNumber(agreed + 1);
          } else {
            // Assume disagree
            this.highlightDisagreed = true;
            this.disagreed = formatStatisticNumber(disagreed + 1);
          }

          if (commented) {
            this.highlightComment = true;
            this.comments = formatStatisticNumber(comments + 1);
          }

          this.changeDetector.detectChanges();
        });
  }
}
