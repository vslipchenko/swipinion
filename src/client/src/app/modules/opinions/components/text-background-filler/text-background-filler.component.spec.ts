import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBackgroundFillerComponent } from './text-background-filler.component';

describe('TextBackgroundFillerComponent', () => {
  let component: TextBackgroundFillerComponent;
  let fixture: ComponentFixture<TextBackgroundFillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextBackgroundFillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextBackgroundFillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
