import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageThumbnailComponent } from './message-thumbnail.component';

describe('MessageThumbnailComponent', () => {
  let component: MessageThumbnailComponent;
  let fixture: ComponentFixture<MessageThumbnailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageThumbnailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessageThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
