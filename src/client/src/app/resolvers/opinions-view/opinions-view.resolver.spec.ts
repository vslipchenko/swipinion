import {TestBed} from '@angular/core/testing';

import {OpinionsViewResolver} from './opinions-view.resolver';

describe('OpinionsViewResolver', () => {
  let resolver: OpinionsViewResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OpinionsViewResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
