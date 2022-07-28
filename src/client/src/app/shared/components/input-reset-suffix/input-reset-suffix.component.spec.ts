import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputResetSuffixComponent } from './input-reset-suffix.component';

describe('InputResetSuffixComponent', () => {
  let component: InputResetSuffixComponent;
  let fixture: ComponentFixture<InputResetSuffixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputResetSuffixComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputResetSuffixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
