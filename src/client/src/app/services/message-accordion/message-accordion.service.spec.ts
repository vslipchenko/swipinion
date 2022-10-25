import {TestBed} from '@angular/core/testing';

import {MessageAccordionService} from './message-accordion.service';

describe('MessageAccordionService', () => {
  let service: MessageAccordionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MessageAccordionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
