import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpinionFailSnackbarComponent } from './opinion-fail-snackbar.component';

describe('OpinionFailSnackbarComponent', () => {
  let component: OpinionFailSnackbarComponent;
  let fixture: ComponentFixture<OpinionFailSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpinionFailSnackbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OpinionFailSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
