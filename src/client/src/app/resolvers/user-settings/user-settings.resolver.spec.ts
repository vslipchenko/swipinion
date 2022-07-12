import { TestBed } from '@angular/core/testing';

import { UserSettingsResolver } from './user-settings.resolver';

describe('UserSettingsResolver', () => {
  let resolver: UserSettingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(UserSettingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
