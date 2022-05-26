import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyOpinionsComponent } from './empty-opinions.component';

describe('EmptyOpinionsComponent', () => {
  let component: EmptyOpinionsComponent;
  let fixture: ComponentFixture<EmptyOpinionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptyOpinionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
