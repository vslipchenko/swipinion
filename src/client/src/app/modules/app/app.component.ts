import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ICONS, ICONS_PATH} from '~app/constants/icons';
import {combineLatest, distinctUntilChanged, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {HeaderService} from '~app/services/header/header.service';
import {ShowMessagesService} from '~app/services/show-messages/show-messages.service';
import {USER_STATUS_POLLING_INTERVAL} from '~app/constants/user-status';
import {Store} from '@ngxs/store';
import {RunUserStatusPolling} from '~app/modules/app/store/app.actions';
import {UserStatusPingerService} from '~app/services/user-status-pinger/user-status-pinger.service';

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
    private readonly store: Store,
    private readonly userStatusPingerService: UserStatusPingerService,
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
      // TODO and if authed
      else if (event.url.startsWith('/profile')) this.showMessagesService.show();
      else if (event.url.startsWith('/user/')) this.showMessagesService.show();
      else this.showMessagesService.hide();
    });

    this.runUserStatusPolling();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public runUserStatusPolling(): void {
    // TODO move script to web worker in order to guarantee stable setInterval callback run as az browser throttles inactive tabs
    let interval: number;

    combineLatest([
      this.userStatusPingerService.runMessagePolling$,
      this.userStatusPingerService.runNotificationPolling$,
    ])
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged((previous, current) => {
          return previous[0] === current[0] && previous[1] === current[1];
        }),
      )
      .subscribe(([checkMessage, checkNotification]) => {
        if (!checkMessage && !checkNotification) return clearInterval(interval);

        this.dispatchUserStatusPolling(checkMessage, checkNotification);

        interval = setInterval(() => {
          this.dispatchUserStatusPolling(checkMessage, checkNotification);
        }, USER_STATUS_POLLING_INTERVAL);
      });
  }

  private dispatchUserStatusPolling(checkMessage: boolean, checkNotification: boolean): void {
    if (document.hidden) return; // Prevent polling when tab is inactive

    this.store.dispatch(
      new RunUserStatusPolling({
        checkMessage,
        checkNotification,
      }),
    );
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
