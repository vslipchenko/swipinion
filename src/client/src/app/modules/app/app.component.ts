import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ICONS, ICONS_PATH} from '~app/constants/icons';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {HeaderService} from '~app/services/header/header.service';
import {ShowMessagesService} from '~app/services/show-messages/show-messages.service';

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
    public readonly headerService: HeaderService,
    public readonly showMessagesService: ShowMessagesService,
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.registerIcons();

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (!(event instanceof NavigationEnd)) return;

      if (event.url === '/sign-in') this.headerService.signIn$.next();
      else if (event.url === '/sign-up') this.headerService.signUp$.next();
      else if (event.url === '/recovery') this.recover$.next();
      // Show messages only in the scope of user module; otherwise hide, including 404 page;
      else if (event.url.startsWith('/profile')) this.showMessagesService.show();
      else if (event.url.startsWith('/user/')) this.showMessagesService.show();
      else this.showMessagesService.hide();
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
