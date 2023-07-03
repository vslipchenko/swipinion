import {MonoTypeOperatorFunction, Subject, takeUntil} from 'rxjs';
import {DestroyRef, inject} from '@angular/core';

export const untilDestroyed = (): (<T>() => MonoTypeOperatorFunction<T>) => {
  const destroyed$ = new Subject<void>();

  inject(DestroyRef).onDestroy((): void => {
    destroyed$.next();
    destroyed$.complete();
  });

  return <T>() => takeUntil<T>(destroyed$.asObservable());
};
