import { TestBed } from '@angular/core/testing';

import { ShowMessagesService } from './show-messages.service';

describe('ShowMessagesService', () => {
  let service: ShowMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShowMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
