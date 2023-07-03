import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {ShowMessagesService} from '~app/services/show-messages/show-messages.service';
import {NavigationEnd, Router} from '@angular/router';
import {untilDestroyed} from '~app/utilities/operator';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageNotFoundComponent {
  @HostBinding('class') private readonly class = 'relative h-100';

  private readonly untilDestroyed = untilDestroyed();

  public constructor(private readonly showMessagesService: ShowMessagesService, private readonly router: Router) {
    this.router.events.pipe(this.untilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      this.showMessagesService.hide();
    });
  }
}
