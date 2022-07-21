import { TestBed } from '@angular/core/testing';

import { UserNavbarService } from './user-navbar.service';

describe('UserNavbarService', () => {
  let service: UserNavbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserNavbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
