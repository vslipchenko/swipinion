import {OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

export interface Destroyable extends OnDestroy {
  readonly destroy$: Subject<void>;
}
