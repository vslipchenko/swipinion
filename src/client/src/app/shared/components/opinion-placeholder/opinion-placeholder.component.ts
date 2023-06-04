import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {Subject, takeUntil, timer} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-opinion-placeholder',
  templateUrl: './opinion-placeholder.component.html',
  styleUrls: ['./opinion-placeholder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OpinionPlaceholderComponent implements Destroyable {
  @Output() public pollNewContent = new EventEmitter<void>();

  public readonly destroy$ = new Subject<void>();

  private readonly POLL_START_DUE = 3000;
  private readonly POLL_INTERVAL = 6000;

  public ngOnInit(): void {
    this.startPolling();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startPolling(): void {
    timer(this.POLL_START_DUE, this.POLL_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.pollNewContent.emit();
      });
  }
}
