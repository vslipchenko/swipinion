import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOpinionDialogComponent } from './add-opinion-dialog.component';

describe('AddOpinionDialogComponent', () => {
  let component: AddOpinionDialogComponent;
  let fixture: ComponentFixture<AddOpinionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOpinionDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOpinionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
