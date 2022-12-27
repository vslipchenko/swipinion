import { TestBed } from '@angular/core/testing';

import { OpinionsRoleResolver } from './opinions-role.resolver';

describe('OpinionsRoleResolver', () => {
  let resolver: OpinionsRoleResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(OpinionsRoleResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
