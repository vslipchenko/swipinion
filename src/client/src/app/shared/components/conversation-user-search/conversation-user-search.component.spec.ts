import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationUserSearchComponent } from './conversation-user-search.component';

describe('ConversationUserSearchComponent', () => {
  let component: ConversationUserSearchComponent;
  let fixture: ComponentFixture<ConversationUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationUserSearchComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
