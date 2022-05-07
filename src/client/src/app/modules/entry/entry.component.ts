import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {first, ReplaySubject, Subject, takeUntil} from 'rxjs';
import {Destroyable} from '~app/typings/component/component.interfaces';

@Component({
  selector: 'app-entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntryComponent implements OnInit, Destroyable {
  public readonly signIn$ = new ReplaySubject<void>(1);
  public readonly signUp$ = new ReplaySubject<void>(1);
  public readonly recover$ = new ReplaySubject<void>(1);
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly activatedRoute: ActivatedRoute) {}

  public ngOnInit(): void {
    this.activatedRoute.data.pipe(first(), takeUntil(this.destroy$)).subscribe((data) => {
      if (data['path'] === 'sign-in') this.signIn$.next();
      if (data['path'] === 'sign-up') this.signUp$.next();
      if (data['path'] === 'recovery') this.recover$.next();
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
