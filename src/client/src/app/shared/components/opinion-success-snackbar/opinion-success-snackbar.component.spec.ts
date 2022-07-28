import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpinionSuccessSnackbarComponent} from './opinion-success-snackbar.component';

describe('OpinionSnackbarComponent', () => {
  let component: OpinionSuccessSnackbarComponent;
  let fixture: ComponentFixture<OpinionSuccessSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionSuccessSnackbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionSuccessSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
