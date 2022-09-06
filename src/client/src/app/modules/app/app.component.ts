import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ICONS, ICONS_PATH} from '~app/constants/icons';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';
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
export class AppComponent implements Destroyable {
  public readonly recover$ = new Subject<void>();
  public readonly destroy$ = new Subject<void>();

  public constructor(
    public readonly authenticationService: AuthenticationService,
    public readonly headerService: HeaderService,
    public readonly showMessagesService: ShowMessagesService,
    private readonly store: Store,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.registerIcons();

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      switch (true) {
        case event.url === '/sign-in':
          this.headerService.signIn$.next();
          break;
        case event.url === '/sign-up':
          this.headerService.signUp$.next();
          break;
        case event.url === '/recovery':
          this.recover$.next();
          break;
        // @ts-expect-error
        case this.authenticationService.authenticated && event.url.startsWith('/profile'):
        case this.authenticationService.authenticated && event.url.startsWith('/user/'):
          this.showMessagesService.show();
          break;
        default:
          this.showMessagesService.hide();
      }
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
