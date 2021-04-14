import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCalendarComponent } from './all-calendar.component';

describe('AllCalendarComponent', () => {
  let component: AllCalendarComponent;
  let fixture: ComponentFixture<AllCalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllCalendarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
