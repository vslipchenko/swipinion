import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailConfirmationDialogComponent } from './email-confirmation-dialog.component';

describe('EmailConfirmationDialogComponent', () => {
  let component: EmailConfirmationDialogComponent;
  let fixture: ComponentFixture<EmailConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailConfirmationDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
