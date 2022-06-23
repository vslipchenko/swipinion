import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileActionBarComponent } from './profile-action-bar.component';

describe('ProfileActionBarComponent', () => {
  let component: ProfileActionBarComponent;
  let fixture: ComponentFixture<ProfileActionBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileActionBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileActionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
