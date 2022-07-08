import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FetchOpinions} from '~app/modules/user/store/user.actions';
import {BehaviorSubject, fromEvent, Observable, Subject, takeUntil} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {ResolvedUserData} from '~app/typings/user/user.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserRole} from '~app/typings/user/user.enums';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, AfterViewInit, Destroyable {
  @Select(UserSelectors.resolvedUserData)
  public readonly profile$!: Observable<ResolvedUserData>;
  @Select(AppSelectors.userRole)
  public readonly role$!: Observable<UserRole>;
  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<Opinion>>;

  @ViewChild('wrapper')
  private readonly wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('userBlock') private readonly userBlock!: ElementRef<HTMLDivElement>;

  public readonly opinions$!: Observable<Array<Opinion>>;
  public readonly userRole = UserRole;
  public readonly showBottomBar$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly username: string = '';
  public readonly isProfilePath: boolean = false;

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    const profileSnapshot = this.profileSnapshot;
    this.username = profileSnapshot.username;
    this.isProfilePath = profileSnapshot.isProfilePath;

    this.opinions$ = this.store.select(
      this.isProfilePath ? UserSelectors.profileOpinionsSlice : UserSelectors.userOpinionsSlice,
    );
  }

  public ngOnInit(): void {
    this.fetchUserOpinions(0);
    console.log(this.router.parseUrl(this.router.url).root.children['primary'].segments);
    debugger;
  }

  public ngAfterViewInit(): void {
    this.trackScrollProgress();
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.showBottomBar$.complete();
  }

  public fetchUserOpinions(offset: number): void {
    this.store.dispatch(
      new FetchOpinions({
        username: this.username,
        offset,
        isProfilePath: this.isProfilePath,
      }),
    );
  }

  public openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      panelClass: ['dialog', 'extended-dialog'],
      data: this.profileSnapshot,
    });
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
