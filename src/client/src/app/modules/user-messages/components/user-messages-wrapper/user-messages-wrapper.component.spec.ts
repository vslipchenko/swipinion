import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMessagesWrapperComponent } from './user-messages-wrapper.component';

describe('UserMessagesWrapperComponent', () => {
  let component: UserMessagesWrapperComponent;
  let fixture: ComponentFixture<UserMessagesWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserMessagesWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMessagesWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
