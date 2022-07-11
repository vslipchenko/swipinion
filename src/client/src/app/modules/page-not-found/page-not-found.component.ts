import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ShowMessagesService} from '~app/services/show-messages/show-messages.service';
import {NavigationEnd, Router} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent implements Destroyable {
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly showMessagesService: ShowMessagesService, private readonly router: Router) {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      this.showMessagesService.hide();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
