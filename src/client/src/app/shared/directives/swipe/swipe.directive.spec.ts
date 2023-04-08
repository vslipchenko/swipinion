import {SwipeDirective} from './swipe.directive';
import {ElementRef} from '@angular/core';

describe('SwipeDirective', () => {
  it('should create an instance', () => {
    const directive = new SwipeDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });
});
