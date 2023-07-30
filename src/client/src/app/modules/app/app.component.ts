import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ICONS, ICONS_PATH} from '~app/constants/icons';
import {Subject} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {untilDestroyed} from '~app/utilities/operator';
import {HeaderService} from '~app/services/header/header.service';
import {ShowMessagesService} from '~app/services/show-messages/show-messages.service';
import {Store} from '@ngxs/store';
import {AuthenticationService} from '~app/services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  protected readonly recover$ = new Subject<void>();
  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    protected readonly headerService: HeaderService,
    protected readonly showMessagesService: ShowMessagesService,
    private readonly authenticationService: AuthenticationService,
    private readonly store: Store,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.registerIcons();

    this.router.events.pipe(this.untilDestroyed()).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      switch (true) {
        case event.url === '/sign-in':
          this.headerService.signIn$.next();
          this.showMessagesService.hide();
          break;
        case event.url === '/sign-up':
          this.headerService.signUp$.next();
          this.showMessagesService.hide();
          break;
        case event.url === '/recovery':
          this.recover$.next();
          this.showMessagesService.hide();
          break;
        // @ts-expect-error
        case event.url === '/profile':
        // @ts-expect-error
        // eslint-disable-next-line no-fallthrough
        case event.url === '/profile/notifications':
        // @ts-expect-error
        // eslint-disable-next-line no-fallthrough
        case event.url === '/profile/settings':
        case this.authenticationService.authenticated && event.url.startsWith('/user/'):
          this.showMessagesService.show();
          break;
        default:
          this.showMessagesService.hide();
      }
    });
  }

  private registerIcons(): void {
    ICONS.forEach((icon) => {
      this.matIconRegistry.addSvgIcon(
        icon,
        this.domSanitizer.bypassSecurityTrustResourceUrl(`${ICONS_PATH}/${icon}.svg`),
      );
    });
  }
}
