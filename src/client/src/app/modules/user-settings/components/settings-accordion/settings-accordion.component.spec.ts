import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsAccordionComponent } from './settings-accordion.component';

describe('SettingsAccordionComponent', () => {
  let component: SettingsAccordionComponent;
  let fixture: ComponentFixture<SettingsAccordionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SettingsAccordionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsAccordionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
