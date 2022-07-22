import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFavoritesTabComponent } from './user-favorites-tab.component';

describe('UserFavoritesTabComponent', () => {
  let component: UserFavoritesTabComponent;
  let fixture: ComponentFixture<UserFavoritesTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserFavoritesTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFavoritesTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
