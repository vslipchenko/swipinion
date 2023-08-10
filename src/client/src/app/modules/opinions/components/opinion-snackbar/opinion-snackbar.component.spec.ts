import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpinionSnackbarComponent} from './opinion-snackbar.component';

describe('OpinionSnackbarComponent', () => {
  let component: OpinionSnackbarComponent;
  let fixture: ComponentFixture<OpinionSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionSnackbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OpinionSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
