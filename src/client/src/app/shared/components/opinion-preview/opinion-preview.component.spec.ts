import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionPreviewComponent } from './opinion-preview.component';

describe('OpinionPreviewComponent', () => {
  let component: OpinionPreviewComponent;
  let fixture: ComponentFixture<OpinionPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionPreviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
