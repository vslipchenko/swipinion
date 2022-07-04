import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnfollowUserDialogComponent } from './unfollow-user-dialog.component';

describe('UnfollowUserDialogComponent', () => {
  let component: UnfollowUserDialogComponent;
  let fixture: ComponentFixture<UnfollowUserDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnfollowUserDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnfollowUserDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
