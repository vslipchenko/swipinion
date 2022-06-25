import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisticsActionComponent } from './statistics-action.component';

describe('StatisticsActionComponent', () => {
  let component: StatisticsActionComponent;
  let fixture: ComponentFixture<StatisticsActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatisticsActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
