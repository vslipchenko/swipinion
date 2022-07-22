import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReactionsTabComponent } from './user-reactions-tab.component';

describe('UserReactionsTabComponent', () => {
  let component: UserReactionsTabComponent;
  let fixture: ComponentFixture<UserReactionsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserReactionsTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserReactionsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
