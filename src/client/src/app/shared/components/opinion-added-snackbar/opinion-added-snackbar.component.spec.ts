import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpinionAddedSnackbarComponent} from './opinion-added-snackbar.component';

describe('OpinionAddedSnackbarComponent', () => {
  let component: OpinionAddedSnackbarComponent;
  let fixture: ComponentFixture<OpinionAddedSnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionAddedSnackbarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionAddedSnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
