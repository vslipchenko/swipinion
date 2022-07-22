import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BehaviorSubject, fromEvent, Observable, Subject, takeUntil} from 'rxjs';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserContentTabIndex, UserRole} from '~app/typings/user/user.enums';
import {MatTabChangeEvent} from '@angular/material/tabs/tab-group';
import {Tab} from '~app/typings/tabs/tabs.interfaces';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements AfterViewInit, Destroyable {
  @Select(UserSelectors.resolvedUserData)
  public readonly profile$!: Observable<ResolvedUserData>;
  @Select(AppSelectors.userRole)
  public readonly role$!: Observable<UserRole>;

  @ViewChild('wrapper')
  private readonly wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('userBlock') private readonly userBlock!: ElementRef<HTMLDivElement>;

  public readonly userRole = UserRole;
  public readonly showBottomBar$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly activeTab$ = new BehaviorSubject(UserContentTabIndex.Opinions);
  public readonly username: string = '';
  public readonly isProfilePath: boolean = false;
  public readonly userContentTabIndex = UserContentTabIndex;
  public readonly userContentTabs: Array<Tab> = [
    {text: 'Opinions', icon: 'article'},
    {
      text: 'Reactions',
      icon: 'thumbs_up_down',
    },
    {text: 'Favorites', icon: 'star'},
  ];

  public constructor(private readonly store: Store, private readonly dialog: MatDialog) {
    const profileSnapshot = this.profileSnapshot;
    this.username = profileSnapshot.username;
    this.isProfilePath = profileSnapshot.isProfilePath;
  }

  public ngAfterViewInit(): void {
    this.trackScrollProgress();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.showBottomBar$.complete();
  }

  public openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      panelClass: ['dialog', 'extended-dialog'],
      data: this.profileSnapshot,
    });
  }

  public navigateTab(event: MatTabChangeEvent): void {
    this.activeTab$.next(event.index);
  }

  private trackScrollProgress(): void {
    fromEvent(this.wrapper.nativeElement, 'scroll')
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        const userBlockScrolledThrough =
          (event.target as HTMLDivElement).scrollTop > this.userBlock.nativeElement.clientHeight;

        this.showBottomBar$.next(userBlockScrolledThrough);
      });
  }

  private get profileSnapshot(): ResolvedUserData {
    return this.store.selectSnapshot(UserSelectors.resolvedUserData);
  }
}
