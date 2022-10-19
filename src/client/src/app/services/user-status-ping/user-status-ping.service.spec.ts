import {TestBed} from '@angular/core/testing';

import {UserStatusPingService} from './user-status-ping.service';

describe('UserStatusPingService', () => {
  let service: UserStatusPingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStatusPingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
