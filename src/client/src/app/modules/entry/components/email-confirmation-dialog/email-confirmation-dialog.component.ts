import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FormControl, ValidationErrors, Validators} from '@angular/forms';
import {Destroyable} from '~app/typings/component/component.interfaces';
import {BehaviorSubject, Subject} from 'rxjs';

@Component({
  selector: 'app-email-confirmation-dialog',
  templateUrl: './email-confirmation-dialog.component.html',
  styleUrls: ['./email-confirmation-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailConfirmationDialogComponent implements Destroyable {
  public readonly code = new FormControl('', Validators.required);
  public readonly loading$ = new BehaviorSubject(false);
  public readonly destroy$ = new Subject<void>();

  public constructor(private readonly activatedRoute: ActivatedRoute) {}

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.loading$.complete();
  }

  public errorMessage(errors: ValidationErrors | null): string | void {
    if (!errors) return;

    return 'Required field';
  }

  public confirm(): void {
    const email = decodeURI(this.activatedRoute.snapshot.queryParams['email']);
  }
}
