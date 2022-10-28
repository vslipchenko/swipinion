import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConversationThumbnailComponent } from './conversation-thumbnail.component';

describe('ConversationThumbnailComponent', () => {
  let component: ConversationThumbnailComponent;
  let fixture: ComponentFixture<ConversationThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConversationThumbnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConversationThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
