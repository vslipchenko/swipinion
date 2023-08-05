import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, fromEvent, Observable} from 'rxjs';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatLegacyDialog as MatDialog} from '@angular/material/legacy-dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {untilDestroyed} from '~app/utilities/operator';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserContentTab, UserRole} from '~app/typings/user/user.enums';
import {Tab} from '~app/typings/tabs/tabs.interfaces';
import {MatLegacyTabChangeEvent as MatTabChangeEvent} from '@angular/material/legacy-tabs';
import {MessageAccordionService} from '~app/services/message-accordion/message-accordion.service';
import {UserSettings} from '~app/typings/user-settings/user-settings.interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements AfterViewInit, OnDestroy {
  @Select(UserSelectors.resolvedUserData)
  protected readonly profile$!: Observable<ResolvedUserData>;

  @ViewChild('wrapper')
  private readonly wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('userBlock') private readonly userBlock!: ElementRef<HTMLDivElement>;

  protected readonly role: UserRole;
  protected readonly showBottomBar$ = new BehaviorSubject(false);
  protected readonly activeTab$ = new BehaviorSubject(UserContentTab.Opinions);
  protected readonly userContentTab = UserContentTab;
  protected readonly userContentTabs: Array<Tab> = [
    {text: 'Opinions', icon: 'article'},
    {
      text: 'Reactions',
      icon: 'thumbs_up_down',
    },
    {text: 'Favorites', icon: 'star'},
  ];
  protected readonly settings: UserSettings;

  private readonly untilDestroyed = untilDestroyed();

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly messagesPanelService: MessageAccordionService,
  ) {
    this.role = this.store.selectSnapshot(AppSelectors.userRole);

    this.settings = this.store.selectSnapshot(UserSelectors.settings);
  }

  public ngAfterViewInit(): void {
    this.trackScrollProgress();
  }

  public ngOnDestroy(): void {
    this.showBottomBar$.complete();

    this.messagesPanelService.liftUpConversationAccordion$.next(false);
  }

  protected openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      panelClass: ['dialog', 'small-dialog'],
      data: this.profileSnapshot,
    });
  }

  protected navigateTab(event: MatTabChangeEvent): void {
    this.activeTab$.next(event.index);
  }

  private trackScrollProgress(): void {
    fromEvent(this.wrapper.nativeElement, 'scroll')
      .pipe(this.untilDestroyed())
      .subscribe((event) => {
        const userBlockScrolledThrough =
          (event.target as HTMLDivElement).scrollTop > this.userBlock.nativeElement.clientHeight;

        this.showBottomBar$.next(userBlockScrolledThrough);

        this.messagesPanelService.liftUpConversationAccordion$.next(userBlockScrolledThrough);
      });
  }

  private get profileSnapshot(): ResolvedUserData {
    return this.store.selectSnapshot(UserSelectors.resolvedUserData);
  }
}
