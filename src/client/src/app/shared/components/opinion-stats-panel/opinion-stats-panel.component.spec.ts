import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpinionStatsPanelComponent} from './opinion-stats-panel.component';

describe('OpinionStatsPanelComponent', () => {
  let component: OpinionStatsPanelComponent;
  let fixture: ComponentFixture<OpinionStatsPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionStatsPanelComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionStatsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
