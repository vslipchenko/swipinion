import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ICONS, ICONS_PATH} from '~app/constants/icons';
import {first, ReplaySubject, Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, Destroyable {
  public readonly signIn$ = new ReplaySubject<void>(1);
  public readonly signUp$ = new ReplaySubject<void>(1);
  public readonly recover$ = new ReplaySubject<void>(1);
  public readonly confirm$ = new ReplaySubject<void>(1);
  public readonly destroy$ = new Subject<void>();

  public constructor(
    // private readonly translocoService: TranslocoService
    private readonly matIconRegistry: MatIconRegistry,
    private readonly domSanitizer: DomSanitizer,
    private readonly activatedRoute: ActivatedRoute,
  ) {
    this.registerIcons();
  }

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(first(), takeUntil(this.destroy$)).subscribe((data) => {
      if (data['path'] === 'sign-in') this.signIn$.next();
      else if (data['path'] === 'sign-up') this.signUp$.next();
      else if (data['path'] === 'recovery') this.recover$.next();
      else if (data['path'] === 'confirmation') this.confirm$.next();
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
