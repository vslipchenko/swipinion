import {Clipboard} from '@angular/cdk/clipboard';
import {Location} from '@angular/common';
import {Injector} from '@angular/core';

export const copyOpinionLink = (injector: Injector, opinionId: string): boolean => {
  const location = injector.get(Location);
  const clipboard = injector.get(Clipboard);

  let relativePath = location.prepareExternalUrl(`opinion/${opinionId}`);

  if (relativePath[0] !== '/') relativePath = '/' + relativePath; // If hash strategy is used - normalize by prepending slash (issue: https://github.com/angular/angular/issues/50917)

  return clipboard.copy(window.location.origin + relativePath);
};
