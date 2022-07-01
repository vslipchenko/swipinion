import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {FetchUserOpinions} from '~app/modules/user/store/user.actions';
import {BehaviorSubject, fromEvent, Observable, Subject, takeUntil} from 'rxjs';
import {Opinion} from '~app/typings/opinion/opinion.interfaces';
import {UserSelectors} from '~app/modules/user/store/user.selectors';
import {MatDialog} from '@angular/material/dialog';
import {EditProfileDialogComponent} from '~app/modules/user/components/edit-profile-dialog/edit-profile-dialog.component';
import {ActivatedRoute} from '@angular/router';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {UserProfile} from '~app/typings/user/user.interfaces';
import {AppSelectors} from '~app/modules/app/store/app.selectors';
import {UserRole} from '~app/typings/user/user.enums';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit, AfterViewInit, Destroyable {
  @Select(UserSelectors.opinionsSlice) public readonly opinions$!: Observable<Array<Opinion>>;
  @Select(UserSelectors.canLoadMore) public readonly canLoadMore$!: Observable<Array<Opinion>>;
  @Select(AppSelectors.userRole)
  public readonly role$!: Observable<UserRole>;

  @ViewChild('wrapper') private readonly wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('userBlock') private readonly userBlock!: ElementRef<HTMLDivElement>;

  public readonly userRole = UserRole;
  public readonly showBottomBar$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();
  public readonly profile$: BehaviorSubject<UserProfile>; // TODO fix; this is not reactive anymore, i.e. on edit data still the same
  public readonly username = '';

  public constructor(
    private readonly store: Store,
    private readonly dialog: MatDialog,
    private readonly route: ActivatedRoute,
  ) {
    this.profile$ = new BehaviorSubject(this.route.snapshot.data['profile']);
    this.username = this.route.snapshot.data['profile'].username;
  }

  public ngOnInit(): void {
    this.fetchUserOpinions(0);
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
      new FetchUserOpinions({
        username: this.profile$.getValue().username,
        offset,
      }),
    );
  }

  public openEditProfile(): void {
    const dialog = this.dialog.open(EditProfileDialogComponent, {
      panelClass: ['dialog', 'extended-dialog'],
      data: this.profile$.getValue(),
    });

    dialog.componentInstance.saved.pipe(takeUntil(dialog.afterClosed())).subscribe((data) => {
      dialog.close();
      this.profile$.next({
        ...this.profile$.getValue(),
        ...data,
      });
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
}
