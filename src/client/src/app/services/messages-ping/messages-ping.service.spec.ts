import { TestBed } from '@angular/core/testing';

import { MessagesPingService } from './messages-ping.service';

describe('MessagesPingService', () => {
  let service: MessagesPingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessagesPingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
