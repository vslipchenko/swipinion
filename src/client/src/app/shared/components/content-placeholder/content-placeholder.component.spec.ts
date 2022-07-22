import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ContentPlaceholderComponent} from './content-placeholder.component';

describe('EmptyContentComponent', () => {
  let component: ContentPlaceholderComponent;
  let fixture: ComponentFixture<ContentPlaceholderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContentPlaceholderComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContentPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
