import {TestBed} from '@angular/core/testing';

import {ProfileSettingsResolver} from './profile-settings.resolver';

describe('ProfileSettingsResolver', () => {
  let resolver: ProfileSettingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ProfileSettingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
