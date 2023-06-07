import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input} from '@angular/core';
import {ButtonComponent} from '~app/shared/components/button/button.component';
import {NgForOf} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {OpinionReaction} from '~app/typings/opinion/opinion.enums';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {formatStatisticNumber} from '~app/utilities/number';

@Component({
  selector: 'app-opinion-stats-panel',
  templateUrl: './opinion-stats-panel.component.html',
  styleUrls: ['./opinion-stats-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgForOf, ButtonComponent],
})
export class OpinionStatsPanelComponent implements AfterViewInit, Destroyable {
  @Input() public agreed = '';
  @Input() public disagreed = '';
  @Input() public comments = '';
  @Input() public buttonClass = '';
  @Input() public updateStatistic?: Subject<{
    reaction: OpinionReaction;
    commented: boolean;
    agreed: number;
    disagreed: number;
    comments: number;
  }>;

  public readonly destroy$ = new Subject<void>();

  protected agreedWith = false;
  protected disagreedWith = false;
  protected commented = false;

  public constructor(private readonly changeDetector: ChangeDetectorRef) {}

  public ngAfterViewInit(): void {
    if (this.updateStatistic)
      this.updateStatistic
        .pipe(takeUntil(this.destroy$))
        .subscribe(({reaction, commented, agreed, disagreed, comments}) => {
          if (reaction === OpinionReaction.Agree) {
            this.agreedWith = true;
            this.agreed = formatStatisticNumber(agreed + 1);
          } else {
            // Assume disagree
            this.disagreedWith = true;
            this.disagreed = formatStatisticNumber(disagreed + 1);
          }

          if (commented) {
            this.commented = true;
            this.comments = formatStatisticNumber(comments + 1);
          }

          this.changeDetector.detectChanges();
        });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
