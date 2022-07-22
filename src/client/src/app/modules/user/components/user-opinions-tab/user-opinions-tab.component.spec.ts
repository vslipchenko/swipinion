import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOpinionsTabComponent } from './user-opinions-tab.component';

describe('UserOpinionsTabComponent', () => {
  let component: UserOpinionsTabComponent;
  let fixture: ComponentFixture<UserOpinionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserOpinionsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOpinionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
