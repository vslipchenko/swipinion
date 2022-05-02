import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputHideSuffixComponent } from './input-hide-suffix.component';

describe('InputHideSuffixComponent', () => {
  let component: InputHideSuffixComponent;
  let fixture: ComponentFixture<InputHideSuffixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputHideSuffixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputHideSuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
