import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessageDialogComponent } from './user-message-dialog.component';

describe('UserMessageDialogComponent', () => {
  let component: UserMessageDialogComponent;
  let fixture: ComponentFixture<UserMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMessageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
