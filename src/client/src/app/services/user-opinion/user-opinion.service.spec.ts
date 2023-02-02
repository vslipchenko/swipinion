import {TestBed} from '@angular/core/testing';

import {UserOpinionService} from './user-opinion.service';

describe('UserOpinionService', () => {
  let service: UserOpinionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserOpinionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
