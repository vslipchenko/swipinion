import { TestBed } from '@angular/core/testing';

import { UserRoleResolver } from './user-role.resolver';

describe('UserRoleResolver', () => {
  let resolver: UserRoleResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserRoleResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
