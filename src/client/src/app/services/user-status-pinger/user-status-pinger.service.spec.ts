import { TestBed } from '@angular/core/testing';

import { UserStatusPingerService } from './user-status-pinger.service';

describe('UserStatusPingerService', () => {
  let service: UserStatusPingerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserStatusPingerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
