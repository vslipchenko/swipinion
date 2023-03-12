import {ComponentFixture, TestBed} from '@angular/core/testing';

import {OpinionPlaceholderComponent} from './opinion-placeholder.component';

describe('EmptyOpinionsComponent', () => {
  let component: OpinionPlaceholderComponent;
  let fixture: ComponentFixture<OpinionPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpinionPlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpinionPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
