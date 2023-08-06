import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {Actions, ofActionCompleted, Select, Store} from '@ngxs/store';
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
import {AddUserOpinionToFavorites, RemoveUserOpinionFromFavorites} from '~app/modules/user/store/user.actions';
import {MatLegacySnackBar as MatSnackBar} from '@angular/material/legacy-snack-bar';

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
    private readonly snackbar: MatSnackBar,
    private readonly actions$: Actions,
  ) {
    this.role = this.store.selectSnapshot(AppSelectors.userRole);

    this.settings = this.store.selectSnapshot(UserSelectors.settings);

    this.actions$
      .pipe(this.untilDestroyed(), ofActionCompleted(AddUserOpinionToFavorites, RemoveUserOpinionFromFavorites))
      .subscribe((completion) => {
        if (completion.result.error) {
          this.snackbar.open('Something went wrong. Please try again later', 'OK', {panelClass: 'snackbar-error'});
          return;
        }

        // TODO consider be spicifc with else condition if ofActionCompleted would include more actions
        const action = completion.action instanceof AddUserOpinionToFavorites ? 'added to' : 'removed from';

        this.snackbar.open(`Opinion was ${action} Favorites`, 'OK', {
          panelClass: 'snackbar-success',
        });
      });
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
