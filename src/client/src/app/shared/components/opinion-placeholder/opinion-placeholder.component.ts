import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {timer} from 'rxjs';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-opinion-placeholder',
  templateUrl: './opinion-placeholder.component.html',
  styleUrls: ['./opinion-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OpinionPlaceholderComponent implements OnInit {
  @Output() public pollNewContent = new EventEmitter<void>();

  private readonly untilDestroyed = untilDestroyed();

  private readonly POLL_START_DUE = 3000;
  private readonly POLL_INTERVAL = 6000;

  public ngOnInit(): void {
    this.startPolling();
  }

  private startPolling(): void {
    timer(this.POLL_START_DUE, this.POLL_INTERVAL)
      .pipe(this.untilDestroyed())
      .subscribe(() => {
        this.pollNewContent.emit();
      });
  }
}
