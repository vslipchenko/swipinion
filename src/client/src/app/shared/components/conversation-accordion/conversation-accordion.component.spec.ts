import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationAccordionComponent } from './conversation-accordion.component';

describe('ConversationAccordionComponent', () => {
  let component: ConversationAccordionComponent;
  let fixture: ComponentFixture<ConversationAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationAccordionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
